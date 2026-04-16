import ImmersiveImageSection from "@/components/sections/home/ImmersiveImageSection";

export default function Zone08Image() {
  return (
    <ImmersiveImageSection
      src="/images/contact/contact.jpg"
      alt=""
      backgroundClassName="bg-[#121110]"
      imageClassName="object-cover object-[center_20%] opacity-90"
      overlayClassName="bg-gradient-to-b from-transparent via-[#121110]/20 to-[#121110]/85 mix-blend-multiply"
    />
  );
}
