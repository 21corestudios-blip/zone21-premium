import Image from "next/image";

interface ImmersiveImageSectionProps {
  src: string;
  alt: string;
  imageClassName?: string;
  overlayClassName?: string;
  backgroundClassName?: string;
}

export default function ImmersiveImageSection({
  src,
  alt,
  imageClassName = "object-cover object-center",
  overlayClassName,
  backgroundClassName = "",
}: ImmersiveImageSectionProps) {
  return (
    <section
      className={`relative h-[100dvh] min-h-screen w-full overflow-hidden ${backgroundClassName}`}
      aria-hidden={alt === "" ? "true" : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={imageClassName}
        sizes="100vw"
      />
      {overlayClassName ? (
        <div
          className={`pointer-events-none absolute inset-0 ${overlayClassName}`}
        />
      ) : null}
    </section>
  );
}
