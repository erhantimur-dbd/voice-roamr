import { LOCALES, type LocaleCode } from "@/lib/product";

export function LocaleSwitch({
  value,
  onChange,
  invert,
}: {
  value: LocaleCode;
  onChange: (code: LocaleCode) => void;
  invert?: boolean;
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as LocaleCode)}
        className={
          invert
            ? "h-11 max-w-[9.5rem] rounded-[12px] border border-bg/15 bg-transparent px-3 text-sm text-bg"
            : "h-11 max-w-[9.5rem] rounded-[12px] border border-border bg-surface px-3 text-sm text-fg"
        }
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
