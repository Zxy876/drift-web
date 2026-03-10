import { fetchWorldState } from "@/lib/drift-backend";

type PlayerDashboardPageProps = {
  params: Promise<{ playerId: string }>;
};

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

export default async function PlayerDashboardPage({ params }: PlayerDashboardPageProps) {
  const { playerId } = await params;
  const result = await fetchWorldState(playerId);

  const payload = asObject(result.data);
  const storyState = asObject(payload?.story_state);
  const narrativeState = asObject(payload?.narrative_state);
  const questState = asObject(payload?.quest_state) ?? asObject(payload?.quest_runtime);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <header className="rounded-xl border border-black/10 p-5 dark:border-white/20">
        <h1 className="text-2xl font-semibold">Player Dashboard</h1>
        <p className="mt-2 text-sm opacity-80">player_id: {playerId}</p>
        <p className="text-sm opacity-80">backend: {result.baseUrl}</p>
      </header>

      {!result.ok && (
        <section className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
          <h2 className="text-lg font-semibold">Backend request failed</h2>
          <p className="mt-2 text-sm">{result.error || "unknown error"}</p>
          <p className="text-sm">status: {result.status}</p>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-black/10 p-4 dark:border-white/20">
          <h2 className="font-semibold">Story</h2>
          <pre className="mt-2 overflow-auto text-xs opacity-85">{JSON.stringify(storyState ?? {}, null, 2)}</pre>
        </article>

        <article className="rounded-xl border border-black/10 p-4 dark:border-white/20">
          <h2 className="font-semibold">Narrative</h2>
          <pre className="mt-2 overflow-auto text-xs opacity-85">{JSON.stringify(narrativeState ?? {}, null, 2)}</pre>
        </article>

        <article className="rounded-xl border border-black/10 p-4 dark:border-white/20">
          <h2 className="font-semibold">Quest</h2>
          <pre className="mt-2 overflow-auto text-xs opacity-85">{JSON.stringify(questState ?? {}, null, 2)}</pre>
        </article>
      </section>

      <section className="rounded-xl border border-black/10 p-4 dark:border-white/20">
        <h2 className="font-semibold">Raw /world/state payload</h2>
        <pre className="mt-2 max-h-[48vh] overflow-auto text-xs opacity-90">
          {JSON.stringify(result.data ?? {}, null, 2)}
        </pre>
      </section>
    </main>
  );
}
