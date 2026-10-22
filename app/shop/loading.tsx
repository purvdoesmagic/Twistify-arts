export default function Loading() {
  return (
    <main className="px-5 pt-10 sm:px-8 lg:pt-16" aria-busy="true">
      <p className="sr-only" role="status">Loading the collection</p>
      <div className="h-24 max-w-xl animate-pulse bg-(--blush)" />
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="aspect-4/5 animate-pulse bg-(--blush)" />
        ))}
      </div>
    </main>
  );
}
