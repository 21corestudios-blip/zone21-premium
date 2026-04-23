#!/opt/homebrew/bin/python3

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from string import Template
from typing import Any


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Orchestration locale GPT redacteur / Gemini controleur pour ZONE 21."
    )
    parser.add_argument(
        "mode",
        choices=["prepare", "draft", "review", "cycle"],
        help="Mode d'execution.",
    )
    parser.add_argument("--config", required=True, help="Chemin vers config.json")
    parser.add_argument("--task", help="Demande utilisateur en ligne de commande")
    parser.add_argument("--task-file", help="Chemin vers un fichier de demande")
    parser.add_argument(
        "--draft-file",
        help="Chemin d'un brouillon existant, utile pour le mode review.",
    )
    parser.add_argument("--target-path", required=True, help="Emplacement cible du document.")
    parser.add_argument("--doc-title", required=True, help="Titre du document.")
    parser.add_argument("--doc-ref", required=True, help="Reference du document.")
    return parser.parse_args()


@dataclass
class ModelConfig:
    command: str
    timeout_seconds: int


@dataclass
class AppConfig:
    project_root: Path
    master_documents: list[Path]
    runs_dir: Path
    gpt: ModelConfig
    gemini: ModelConfig


def load_config(config_path: Path) -> AppConfig:
    raw = json.loads(config_path.read_text(encoding="utf-8"))
    return AppConfig(
        project_root=Path(raw["project_root"]),
        master_documents=[Path(p) for p in raw["master_documents"]],
        runs_dir=Path(raw["runs_dir"]),
        gpt=ModelConfig(**raw["gpt"]),
        gemini=ModelConfig(**raw["gemini"]),
    )


def read_task(args: argparse.Namespace) -> str:
    if args.task:
        return args.task.strip()
    if args.task_file:
        return Path(args.task_file).read_text(encoding="utf-8").strip()
    raise SystemExit("Il faut fournir --task ou --task-file.")


def docx_to_text(path: Path) -> str:
    result = subprocess.run(
        ["textutil", "-convert", "txt", "-stdout", str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    return normalize_whitespace(result.stdout)


def normalize_whitespace(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = text.replace("\f", "\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


def build_master_bundle(config: AppConfig) -> str:
    sections = []
    for path in config.master_documents:
        sections.append(f"===== SOURCE MAITRE: {path.name} =====\n")
        sections.append(docx_to_text(path))
        sections.append("\n")
    return "".join(sections).strip() + "\n"


def utc_stamp() -> str:
    return datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def write_text(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def load_prompt(path: Path) -> str:
    return path.read_text(encoding="utf-8").strip() + "\n"


def build_gpt_user_prompt(
    task: str,
    target_path: str,
    doc_title: str,
    doc_ref: str,
    master_bundle: str,
) -> str:
    template = Template(
        """
CONTEXTE DE GOUVERNANCE

$master_bundle

MISSION

Tu dois produire un document redactionnel pour ZONE 21.

Titre attendu : $doc_title
Reference attendue : $doc_ref
Emplacement cible : $target_path

Demande utilisateur :
$task

Contraintes d'execution :
- respecter strictement les sources maitres ci-dessus
- ne rien inventer qui contredise les referentiels actifs
- fournir un texte directement exploitable
- signaler en fin de reponse les inscriptions utiles au registre central
        """
    )
    return normalize_whitespace(
        template.substitute(
            master_bundle=master_bundle,
            doc_title=doc_title,
            doc_ref=doc_ref,
            target_path=target_path,
            task=task,
        )
    )


def build_gemini_user_prompt(
    task: str,
    target_path: str,
    doc_title: str,
    doc_ref: str,
    draft: str,
    master_bundle: str,
) -> str:
    template = Template(
        """
CONTEXTE DE GOUVERNANCE

$master_bundle

MISSION DE CONTROLE

Tu controles une production GPT.

Titre attendu : $doc_title
Reference attendue : $doc_ref
Emplacement cible : $target_path

Demande utilisateur initiale :
$task

BROUILLON PRODUIT PAR GPT

$draft

Consignes :
- verifier la conformite a la doctrine des sources
- verifier l'alignement avec la structure documentaire et le registre central
- signaler toute derive, contradiction, invention risquee ou oubli structurant
- proposer les mises a jour pertinentes pour le registre central ou les documents maitres
- si le texte n'est pas validable, renvoyer "block"
        """
    )
    return normalize_whitespace(
        template.substitute(
            master_bundle=master_bundle,
            doc_title=doc_title,
            doc_ref=doc_ref,
            target_path=target_path,
            task=task,
            draft=draft,
        )
    )


def run_command(
    command_template: str,
    timeout_seconds: int,
    replacements: dict[str, str],
) -> subprocess.CompletedProcess[str]:
    if not command_template.strip():
        raise RuntimeError("Commande modele vide dans la configuration.")
    command = command_template.format(**replacements)
    return subprocess.run(
        command,
        shell=True,
        text=True,
        capture_output=True,
        timeout=timeout_seconds,
    )


def extract_json_blob(raw_text: str) -> str:
    start = raw_text.find("{")
    end = raw_text.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError("Aucun objet JSON detecte dans la sortie Gemini.")
    return raw_text[start : end + 1]


def parse_review(raw_text: str) -> dict[str, Any]:
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        return json.loads(extract_json_blob(raw_text))


def build_alert_markdown(review: dict[str, Any], manifest: dict[str, Any]) -> str:
    lines = [
        f"# Alerte Gemini - {manifest['run_id']}",
        "",
        f"- Statut : `{review.get('status', 'unknown')}`",
        f"- Document : `{manifest['doc_ref']}`",
        f"- Titre : {manifest['doc_title']}",
        f"- Emplacement cible : `{manifest['target_path']}`",
        "",
        "## Resume",
        "",
        review.get("summary", "Aucun resume fourni."),
        "",
    ]
    violations = review.get("violations", [])
    if violations:
        lines.extend(["## Derives detectees", ""])
        for item in violations:
            lines.append(
                f"- [{item.get('severity', 'unknown')}] {item.get('rule', 'Regle non precisee')} : {item.get('issue', 'Aucune description')}"
            )
            if item.get("required_fix"):
                lines.append(f"  Correction demandee : {item['required_fix']}")
            if item.get("evidence"):
                lines.append(f"  Preuve : {item['evidence']}")
        lines.append("")
    updates = review.get("required_updates", [])
    if updates:
        lines.extend(["## Mises a jour systeme proposees", ""])
        for item in updates:
            lines.append(
                f"- {item.get('target', 'Cible non precisee')} : {item.get('proposal', 'Proposition non precisee')}"
            )
            if item.get("reason"):
                lines.append(f"  Motif : {item['reason']}")
        lines.append("")
    instructions = review.get("revised_instructions_for_gpt", [])
    if instructions:
        lines.extend(["## Instructions revisees pour GPT", ""])
        for item in instructions:
            lines.append(f"- {item}")
        lines.append("")
    return "\n".join(lines).strip() + "\n"


def build_register_update(review: dict[str, Any], manifest: dict[str, Any]) -> str:
    entries = review.get("register_central_updates", [])
    lines = [
        f"Titre : Proposition d'inscription au registre central - {manifest['doc_ref']}",
        f"Reference : NOTE-Z21-REG-UPDATE-{manifest['run_id']}",
        "Statut : Document de travail",
        f"Date : {manifest['date_local']}",
        "Auteur : Gemini",
        (
            "Chemin : /ZONE21_DEV/10_BACKEND/05_SCRIPTS_ET_CONNECTEURS/"
            "z21_ai_guardian/runs/"
            f"{manifest['run_id']}/register_update.md"
        ),
        "",
        "Objet",
        (
            f"Proposition de mise a jour du registre central apres controle du document "
            f"{manifest['doc_ref']}."
        ),
        "",
        "Elements proposes",
    ]
    if entries:
        for item in entries:
            lines.append(f"- {item}")
    else:
        lines.append("- Aucun element explicite propose par Gemini.")
    lines.extend(
        [
            "",
            "Effet systeme attendu",
            (
                "Maintenir l'alignement entre la production documentaire, la doctrine "
                "des sources actives et la memoire decisionnelle du projet."
            ),
        ]
    )
    return "\n".join(lines).strip() + "\n"


def build_manifest(args: argparse.Namespace, run_dir: Path) -> dict[str, Any]:
    now_local = datetime.now()
    return {
        "run_id": run_dir.name,
        "date_local": now_local.strftime("%Y-%m-%d"),
        "timestamp_local": now_local.isoformat(timespec="seconds"),
        "doc_title": args.doc_title,
        "doc_ref": args.doc_ref,
        "target_path": args.target_path,
        "task_source": "inline" if args.task else "file",
    }


def main() -> int:
    args = parse_args()
    config = load_config(Path(args.config))

    ensure_dir(config.runs_dir)
    run_dir = config.runs_dir / utc_stamp()
    ensure_dir(run_dir)

    manifest = build_manifest(args, run_dir)
    master_bundle = build_master_bundle(config)
    write_text(run_dir / "master_bundle.txt", master_bundle)
    write_text(run_dir / "manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2))

    if args.mode == "review":
        if not args.draft_file:
            raise SystemExit("Le mode review exige --draft-file.")
        task = read_task(args)
        draft = Path(args.draft_file).read_text(encoding="utf-8")
        write_text(run_dir / "task.txt", task)
        write_text(run_dir / "draft.txt", draft)
    else:
        task = read_task(args)
        write_text(run_dir / "task.txt", task)
        draft = ""

    base_dir = Path(__file__).resolve().parent
    gpt_system = load_prompt(base_dir / "prompts" / "gpt_system.txt")
    gemini_system = load_prompt(base_dir / "prompts" / "gemini_system.txt")
    write_text(run_dir / "gpt_system.txt", gpt_system)
    write_text(run_dir / "gemini_system.txt", gemini_system)

    if args.mode in {"prepare", "draft", "cycle"}:
        gpt_user = build_gpt_user_prompt(
            task=task,
            target_path=args.target_path,
            doc_title=args.doc_title,
            doc_ref=args.doc_ref,
            master_bundle=master_bundle,
        )
        write_text(run_dir / "gpt_user.txt", gpt_user)
    else:
        gpt_user = ""

    if args.mode == "prepare":
        print(run_dir)
        return 0

    if args.mode in {"draft", "cycle"}:
        draft_out = run_dir / "draft.txt"
        gpt_result = run_command(
            config.gpt.command,
            config.gpt.timeout_seconds,
            {
                "system_file": str(run_dir / "gpt_system.txt"),
                "user_file": str(run_dir / "gpt_user.txt"),
                "output_file": str(draft_out),
                "task_file": str(run_dir / "task.txt"),
                "draft_file": str(draft_out),
                "review_file": str(run_dir / "review.json"),
                "run_dir": str(run_dir),
            },
        )
        write_text(run_dir / "gpt_stdout.txt", gpt_result.stdout)
        write_text(run_dir / "gpt_stderr.txt", gpt_result.stderr)
        if gpt_result.returncode != 0:
            raise SystemExit(f"Echec GPT, code {gpt_result.returncode}. Voir {run_dir}.")
        if draft_out.exists() and draft_out.stat().st_size > 0:
            draft = draft_out.read_text(encoding="utf-8")
        else:
            draft = normalize_whitespace(gpt_result.stdout)
            write_text(draft_out, draft)

    if args.mode in {"review", "cycle"}:
        gemini_user = build_gemini_user_prompt(
            task=task,
            target_path=args.target_path,
            doc_title=args.doc_title,
            doc_ref=args.doc_ref,
            draft=draft,
            master_bundle=master_bundle,
        )
        write_text(run_dir / "gemini_user.txt", gemini_user)
        review_out = run_dir / "review.json"
        gemini_result = run_command(
            config.gemini.command,
            config.gemini.timeout_seconds,
            {
                "system_file": str(run_dir / "gemini_system.txt"),
                "user_file": str(run_dir / "gemini_user.txt"),
                "output_file": str(review_out),
                "task_file": str(run_dir / "task.txt"),
                "draft_file": str(run_dir / "draft.txt"),
                "review_file": str(review_out),
                "run_dir": str(run_dir),
            },
        )
        write_text(run_dir / "gemini_stdout.txt", gemini_result.stdout)
        write_text(run_dir / "gemini_stderr.txt", gemini_result.stderr)
        if gemini_result.returncode != 0:
            raise SystemExit(f"Echec Gemini, code {gemini_result.returncode}. Voir {run_dir}.")
        raw_review = gemini_result.stdout
        if review_out.exists() and review_out.stat().st_size > 0:
            raw_review = review_out.read_text(encoding="utf-8")
        review = parse_review(raw_review)
        write_text(run_dir / "review.json", json.dumps(review, ensure_ascii=False, indent=2))
        write_text(run_dir / "alert.md", build_alert_markdown(review, manifest))
        write_text(run_dir / "register_update.md", build_register_update(review, manifest))

    print(run_dir)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except subprocess.TimeoutExpired as exc:
        raise SystemExit(f"Commande expiree apres {exc.timeout} secondes.")
