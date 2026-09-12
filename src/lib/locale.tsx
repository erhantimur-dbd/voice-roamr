import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { type LocaleCode } from "@/lib/product";
import { readStoredLocale, t as translate, writeStoredLocale, type MsgKey } from "@/lib/i18n";

type Ctx = {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
  t: (key: MsgKey) => string;
};

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>("en");
  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);
  const value = useMemo<Ctx>(
    () => ({
      locale,
      setLocale: (code) => {
        setLocaleState(code);
        writeStoredLocale(code);
      },
      t: (key) => translate(locale, key),
    }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("LocaleProvider missing");
  return ctx;
}
