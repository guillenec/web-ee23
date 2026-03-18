export default function LoadingNovedadesPage() {
  return (
    <main className="min-h-[60vh] bg-app px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-7 w-80 animate-pulse rounded bg-brand-dark/10" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-brand-dark/10 bg-surface p-5">
              <div className="h-40 animate-pulse rounded-xl bg-brand-dark/10" />
              <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-brand-dark/10" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-brand-dark/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
