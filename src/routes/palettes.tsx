import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StudioShell } from "@/components/StudioShell";
import { useColor, useSaved } from "@/hooks/useColor";
import { harmonies, hslToHex, ramp } from "@/lib/color";

export const Route = createFileRoute("/palettes")({
  head: () => ({
    meta: [
      { title: "Palettes — Prisma Color Studio" },
      {
        name: "description",
        content: "Generate complementary, analogous and triadic harmonies plus tint and shade ramps.",
      },
      { property: "og:title", content: "Palettes — Prisma Color Studio" },
      {
        property: "og:description",
        content: "Generate complementary, analogous and triadic harmonies plus tint and shade ramps.",
      },
    ],
  }),
  component: PalettesPage,
});

function PalettesPage() {
  const { hsl, hex } = useColor();
  const { add } = useSaved();
  const [copied, setCopied] = useState<string | null>(null);
  const sets = harmonies(hsl);
  const shades = ramp(hsl);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      /* ignore */
    }
  };

  const exportCss = () => {
    const css = shades
      .map((c, i) => `  --brand-${(i + 1) * 100}: ${hslToHex(c)};`)
      .join("\n");
    copy(`:root {\n${css}\n}`);
  };

  return (
    <StudioShell>
      <section className="relative mx-auto max-w-6xl px-5 pt-8 pb-10 md:px-8 md:pt-12">
        <div className="hero-grad pointer-events-none absolute -top-24 left-1/2 h-[320px] w-[520px] -translate-x-1/2 rounded-full opacity-15 blur-3xl" />
        <div className="relative text-center">
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Palette generator
          </p>
          <h1 className="hero-grad-text mt-6 text-5xl leading-[0.9] font-bold md:text-7xl">
            Harmonize.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Every set below derives from{" "}
            <span className="font-mono text-foreground">{hex}</span>. Tap any swatch to copy it.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-10 md:grid-cols-2 md:px-8">
        {Object.entries(sets).map(([name, colors]) => (
          <div key={name} className="panel p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {name}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {colors.length} colors
              </span>
            </div>
            <div className="flex gap-2">
              {colors.map((c, i) => {
                const value = hslToHex(c);
                return (
                  <button
                    key={i}
                    onClick={() => copy(value)}
                    onDoubleClick={() => add(value)}
                    className="h-20 flex-1 rounded-lg ring-1 ring-white/10"
                    style={{ background: value }}
                    aria-label={value}
                  />
                );
              })}
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground">
              {colors.map((c, i) => (
                <span key={i}>{copied === hslToHex(c) ? "Copied" : hslToHex(c)}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-10 md:px-8">
        <div className="panel p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Tint · shade ramp
            </span>
            <button
              onClick={exportCss}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold transition-colors hover:border-accent/60"
            >
              Copy as CSS variables
            </button>
          </div>
          <div className="flex h-20 overflow-hidden rounded-lg ring-1 ring-white/10">
            {shades.map((c, i) => {
              const value = hslToHex(c);
              return (
                <button
                  key={i}
                  onClick={() => copy(value)}
                  className="flex-1"
                  style={{ background: value }}
                  aria-label={value}
                />
              );
            })}
          </div>
        </div>
      </section>
    </StudioShell>
  );
}
