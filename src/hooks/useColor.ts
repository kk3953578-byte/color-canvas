import { useCallback, useEffect, useState } from "react";
import { CURRENT_KEY, hexToHsl, hslToHex, loadSaved, storeSaved, type HSL } from "@/lib/color";

const DEFAULT: HSL = { h: 270, s: 95, l: 75 };

export function useColor() {
  const [hsl, setHsl] = useState<HSL>(DEFAULT);

  useEffect(() => {
    const raw = window.localStorage.getItem(CURRENT_KEY);
    const parsed = raw ? hexToHsl(raw) : null;
    if (parsed) setHsl(parsed);
  }, []);

  const update = useCallback((next: HSL) => {
    setHsl(next);
    try {
      window.localStorage.setItem(CURRENT_KEY, hslToHex(next));
    } catch {
      /* ignore */
    }
  }, []);

  return { hsl, setColor: update, hex: hslToHex(hsl) };
}

export function useSaved() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => setSaved(loadSaved()), []);

  const persist = (list: string[]) => {
    setSaved(list);
    storeSaved(list);
  };

  return {
    saved,
    add: (hex: string) => persist(saved.includes(hex) ? saved : [hex, ...saved].slice(0, 60)),
    remove: (hex: string) => persist(saved.filter((c) => c !== hex)),
    clear: () => persist([]),
  };
}
