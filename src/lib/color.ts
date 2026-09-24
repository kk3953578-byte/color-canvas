export type HSL = { h: number; s: number; l: number };

export function hslToRgb({ h, s, l }: HSL): [number, number, number] {
  const S = s / 100;
  const L = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export function hslToHex(hsl: HSL): string {
  const [r, g, b] = hslToRgb(hsl);
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function hexToHsl(hex: string): HSL | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const int = parseInt(m[1] as string, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export const rotate = (hsl: HSL, deg: number): HSL => ({ ...hsl, h: (hsl.h + deg + 360) % 360 });

export function ramp(hsl: HSL, steps = 9): HSL[] {
  return Array.from({ length: steps }, (_, i) => ({
    ...hsl,
    l: Math.round(92 - (i * 80) / (steps - 1)),
  }));
}

export const harmonies = (hsl: HSL) => ({
  Complementary: [hsl, rotate(hsl, 180)],
  Analogous: [rotate(hsl, -30), hsl, rotate(hsl, 30)],
  Triadic: [hsl, rotate(hsl, 120), rotate(hsl, 240)],
  "Split complementary": [hsl, rotate(hsl, 150), rotate(hsl, 210)],
});

const KEY = "prisma-saved-colors";

export function loadSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function storeSaved(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export const CURRENT_KEY = "prisma-current-color";
