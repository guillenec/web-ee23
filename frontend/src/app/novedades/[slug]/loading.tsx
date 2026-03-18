export default function LoadingNovedadDetallePage() {
  return (
    <main className="min-h-[60vh] bg-app">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
        <div className="rounded-3xl border border-brand-dark/10 bg-surface p-6 sm:p-8">
          <div className="h-60 animate-pulse rounded-2xl bg-brand-dark/10 sm:h-80" />
          <div className="mt-6 h-4 w-24 animate-pulse rounded bg-brand-dark/10" />
          <div className="mt-4 h-8 w-4/5 animate-pulse rounded bg-brand-dark/10" />
          <div className="mt-6 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-brand-dark/10" />
            <div className="h-4 w-full animate-pulse rounded bg-brand-dark/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-brand-dark/10" />
          </div>
        </div>
      </div>
    </main>
  );
}
