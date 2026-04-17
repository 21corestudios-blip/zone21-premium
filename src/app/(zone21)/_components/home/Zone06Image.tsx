import ImmersiveImageSection from "./shared/ImmersiveImageSection";

export default function Zone06Image() {
  return (
    <ImmersiveImageSection
      src="/images/a_propos/en-tete.jpg"
      alt=""
      backgroundClassName="bg-white"
      imageClassName="object-cover object-[center_20%]"
      overlayClassName="bg-gradient-to-b from-transparent via-[#121110]/10 to-[#121110]/65 mix-blend-multiply"
    />
  );
}
