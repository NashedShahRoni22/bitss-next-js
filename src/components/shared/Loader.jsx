export default function Loader() {
  return (
    <div className="inline-flex items-center space-x-2 bg-white dark:invert">
      <span className="sr-only">Loading...</span>
      <div className="size-1.5 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
      <div className="size-1.5 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
      <div className="size-1.5 animate-bounce rounded-full bg-black"></div>
    </div>
  );
}
