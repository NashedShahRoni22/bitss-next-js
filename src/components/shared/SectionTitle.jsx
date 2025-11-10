export default function SectionTitle({ children, mdTextLeft = false }) {
  return (
    <h2
      className={`mb-6 text-center text-3xl font-bold md:text-[2.5rem] ${mdTextLeft && "md:text-left"}`}
    >
      {children}
    </h2>
  );
}
