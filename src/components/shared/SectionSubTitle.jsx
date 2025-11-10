export default function SectionSubTitle({ children, customStyle = false }) {
  return (
    <p
      className={`w-full text-balance text-xl font-light ${customStyle ? "mb-6 md:text-left" : "mb-20 text-center"}`}
    >
      {children}
    </p>
  );
}
