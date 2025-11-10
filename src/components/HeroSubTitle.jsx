export default function HeroSubTitle({ children, mdTextLeft = false }) {
  return (
    <p
      className={`mb-8 text-center text-lg font-light md:text-xl ${mdTextLeft && "md:text-left"}`}
    >
      {children}
    </p>
  );
}
