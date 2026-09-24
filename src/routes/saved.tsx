import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StudioShell } from "@/components/StudioShell";
import { useSaved } from "@/hooks/useColor";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved — Prisma Color Studio" },
      { name: "description", content: "Your saved color library, ready to copy or export." },
      { property: "og:title", content: "Saved — Prisma Color Studio" },
      {
        property: "og:description",
        content: "Your saved color library, ready to copy or export.",
      },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { saved, remove, clear } = useSaved();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      /* ignore */
    }
  };

  return (
    <StudioShell>
      <section className="relative mx-auto max-w-6xl px-5 pt-8 pb-10 md:px-8 md:pt-12">
        <div className="hero-grad pointer-events-none absolute -top-24 left-1/2 h-[320px] w-[520px] -translate-x-1/2 rounded-full opacity-15 blur-3xl" />
        <div className="relative text-center">
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Library
          </p>
          <h1 className="hero-grad-text mt-6 text-5xl leading-[0.9] font-bold md:text-7xl">
            Keep.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            {saved.length} color{saved.length === 1 ? "" : "s"} stored on this device.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10 md:px-8">
        {saved.length === 0 ? (
          <div className="panel p-10 text-center">
            <p className="text-sm text-muted-foreground">Your library is empty.</p>
            <Link
              to="/"
              className="hero-grad mt-5 inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
            >
              Go pick a color
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Swatches
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => copy(saved.join(", "))}
                  className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold transition-colors hover:border-accent/60"
                >
                  Copy all
                </button>
                <button
                  onClick={clear}
                  className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-destructive transition-colors hover:border-destructive/60"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {saved.map((c) => (
                <div key={c} className="panel overflow-hidden">
                  <button
                    onClick={() => copy(c)}
                    className="block h-24 w-full"
                    style={{ background: c }}
                    aria-label={`Copy ${c}`}
                  />
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="font-mono text-xs">{copied === c ? "Copied" : c}</span>
                    <button
                      onClick={() => remove(c)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={`Remove ${c}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </StudioShell>
  );
}
