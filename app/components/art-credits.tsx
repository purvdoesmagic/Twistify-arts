export function ArtCredits({ credits }: { credits: string[] }) {
  return (
    <section className="px-5 pt-16 sm:px-8" aria-labelledby="credits-heading">
      <h2 id="credits-heading" className="font-sans text-[length:var(--step-small)] font-medium">
        Pictures on this page
      </h2>
      <ul className={`mt-3 grid gap-x-12 gap-y-2 text-[var(--muted)] ${credits.length > 1 ? "md:grid-cols-2" : ""}`}>
        {credits.map((credit) => (
          <li key={credit} className="max-w-[60ch]">{credit}</li>
        ))}
      </ul>
    </section>
  );
}
