"use client";

export default function ContactForm() {
  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <div>
        <label
          htmlFor="contact-name"
          className="mb-2 block font-sans text-[0.65rem] uppercase tracking-[0.2em] text-bg/80"
        >
          Nom
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Votre nom"
          className="w-full border-b border-bg/20 bg-transparent px-0 py-3 font-sans text-sm text-bg placeholder:text-bg/30 focus:border-bg/60 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-2 block font-sans text-[0.65rem] uppercase tracking-[0.2em] text-bg/80"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="vous@exemple.com"
          className="w-full border-b border-bg/20 bg-transparent px-0 py-3 font-sans text-sm text-bg placeholder:text-bg/30 focus:border-bg/60 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-2 block font-sans text-[0.65rem] uppercase tracking-[0.2em] text-bg/80"
        >
          Objet
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="Votre demande"
          className="w-full border-b border-bg/20 bg-transparent px-0 py-3 font-sans text-sm text-bg placeholder:text-bg/30 focus:border-bg/60 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block font-sans text-[0.65rem] uppercase tracking-[0.2em] text-bg/80"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder="Parlez-nous de votre projet"
          className="w-full resize-none border-b border-bg/20 bg-transparent px-0 py-3 font-sans text-sm text-bg placeholder:text-bg/30 focus:border-bg/60 focus:outline-none"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="inline-flex items-center justify-center bg-bg px-8 py-4 text-paper transition-colors duration-500 hover:bg-surface-hover"
        >
          <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.25em]">
            Envoyer
          </span>
        </button>
      </div>
    </form>
  );
}
