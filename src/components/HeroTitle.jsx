export default function HeroTitle({ children, mdTextLeft = false }) {
  return (
    <h1
      className={`mb-6 text-balance text-center text-4xl font-bold md:text-5xl ${mdTextLeft && "md:text-left"}`}
    >
      {children}
    </h1>
  );
}
