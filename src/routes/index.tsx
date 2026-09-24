import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { StudioShell } from "@/components/StudioShell";
import { useColor, useSaved } from "@/hooks/useColor";
import { harmonies, hexToHsl, hslToHex, hslToRgb, type HSL } from "@/lib/color";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Picker — Prisma Color Studio" },
      {
        name: "description",
        content: "Pick any color on the spectrum and read its HEX, RGB and HSL values instantly.",
      },
      { property: "og:title", content: "Picker — Prisma Color Studio" },
      {
        property: "og:description",
        content: "Pick any color on the spectrum and read its HEX, RGB and HSL values instantly.",
      },
    ],
  }),
  component: PickerPage,
});

function PickerPage() {
  const { hsl, setColor, hex } = useColor();
  const { saved, add } = useSaved();
  const [copied, setCopied] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const [r, g, b] = hslToRgb(hsl);
  const sets = harmonies(hsl);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      /* ignore */
    }
  };

  const pickFromField = (clientX: number, clientY: number) => {
    const el = fieldRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    setColor({ h: hsl.h, s: Math.round(x * 100), l: Math.round((1 - y) * 100) });
  };

  return (
    <StudioShell>
      <section className="relative mx-auto max-w-6xl px-5 pt-8 pb-10 md:px-8 md:pt-14">
        <div className="hero-grad pointer-events-none absolute -top-24 left-1/2 h-[380px] w-[560px] -translate-x-1/2 rounded-full opacity-20 blur-3xl" />
        <div className="relative text-center">
          <p className="font-mono text-[11px] tracking-[0.35em] text-muted-foreground uppercase">
            Color Engine
          </p>
          <h1 className="hero-grad-text mt-6 text-6xl leading-[0.9] font-bold md:text-8xl">Pick.</h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            A precision color studio for designers who sweat the last hex. Extract, harmonize, and
            export in one flow.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => add(hex)}
              className="hero-grad rounded-full px-7 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
            >
              Save this color
            </button>
            <span className="font-mono text-xs text-muted-foreground">v2.1</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-10 md:grid-cols-12 md:px-8">
        <div className="panel p-5 md:col-span-7 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Color picker
            </span>
            <span className="font-mono text-xs text-muted-foreground">H {hsl.h}°</span>
          </div>

          <div
            ref={fieldRef}
            role="presentation"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              pickFromField(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (e.buttons === 1) pickFromField(e.clientX, e.clientY);
            }}
            className="relative aspect-[16/9] w-full cursor-crosshair overflow-hidden rounded-xl outline outline-white/10"
            style={{
              background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #808080, hsl(${hsl.h} 100% 50%))`,
            }}
          >
            <span
              className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-black/30"
              style={{ left: `${hsl.s}%`, top: `${100 - hsl.l}%` }}
            />
          </div>

          <label className="mt-4 block">
            <span className="sr-only">Hue</span>
            <input
              type="range"
              min={0}
              max={360}
              value={hsl.h}
              onChange={(e) => setColor({ ...hsl, h: Number(e.target.value) })}
              className="h-3 w-full cursor-pointer appearance-none rounded-full"
              style={{
                background:
                  "linear-gradient(90deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)",
              }}
            />
          </label>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Readout label="Hex" value={hex} onCopy={copy} copied={copied} />
            <Readout label="RGB" value={`${r} ${g} ${b}`} onCopy={copy} copied={copied} />
            <Readout
              label="HSL"
              value={`${hsl.h} ${hsl.s} ${hsl.l}`}
              onCopy={copy}
              copied={copied}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <input
              value={hex}
              onChange={(e) => {
                const parsed = hexToHsl(e.target.value);
                if (parsed) setColor(parsed);
              }}
              className="w-36 rounded-lg border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-accent"
              aria-label="Hex value"
            />
            <input
              type="color"
              value={hex}
              onChange={(e) => {
                const parsed = hexToHsl(e.target.value);
                if (parsed) setColor(parsed);
              }}
              className="size-10 cursor-pointer rounded-lg border border-border bg-secondary"
              aria-label="System color picker"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 md:col-span-5">
          <div className="panel p-5 md:p-6">
            <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Harmonies
            </span>
            <div className="mt-4 flex gap-2">
              {sets.Analogous.concat(sets.Triadic.slice(1)).map((c: HSL, i) => (
                <button
                  key={i}
                  onClick={() => setColor(c)}
                  className="h-16 flex-1 rounded-lg"
                  style={{ background: hslToHex(c) }}
                  aria-label={hslToHex(c)}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>Analogous</span>
              <span>Split</span>
              <span>Triad</span>
            </div>
            <Link
              to="/palettes"
              className="mt-4 inline-block font-mono text-[10px] text-accent hover:underline"
            >
              Open palette generator →
            </Link>
          </div>

          <div className="panel flex-1 p-5 md:p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                Saved colors
              </span>
              <Link to="/saved" className="font-mono text-[10px] text-accent hover:underline">
                View all
              </Link>
            </div>
            {saved.length === 0 ? (
              <p className="mt-4 font-mono text-[11px] text-muted-foreground">
                Nothing saved yet. Pick a color and hit save.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-6 gap-2">
                {saved.slice(0, 18).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      const parsed = hexToHsl(c);
                      if (parsed) setColor(parsed);
                    }}
                    className="aspect-square rounded-md ring-1 ring-white/10"
                    style={{ background: c }}
                    aria-label={c}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </StudioShell>
  );
}

function Readout({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: (v: string) => void;
  copied: string | null;
}) {
  return (
    <button
      onClick={() => onCopy(value)}
      className="rounded-lg border border-border bg-secondary p-3 text-left transition-colors hover:border-accent/60"
    >
      <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {copied === value ? "Copied" : label}
      </span>
      <span className="mt-1 block font-mono text-lg">{value}</span>
    </button>
  );
}
