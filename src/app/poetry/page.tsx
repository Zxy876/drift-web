import PoetryClient from "./poetry-client";

export default function PoetryPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8">
      <header className="rounded-xl border border-black/10 p-5 dark:border-white/20">
        <h1 className="text-2xl font-semibold">Poetry Scene Generator</h1>
        <p className="mt-2 text-sm opacity-80">route: /poetry</p>
        <p className="text-sm opacity-80">Poem → Concept → Resource → Fragment → Scene 的可视化调试入口。</p>
      </header>

      <PoetryClient />
    </main>
  );
}
