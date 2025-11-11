export default function SectionContainer({ children }) {
  return (
    <section className="w-full px-5 py-10 md:mx-auto md:max-w-7xl md:px-0 md:py-20">
      {children}
    </section>
  );
}
