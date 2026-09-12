import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ink = "#14110c";
const teal = "#1a6b5c";

export function AreaTrend({
  data,
  dataKey,
  label,
}: {
  data: { day: string; [k: string]: string | number }[];
  dataKey: string;
  label: string;
}) {
  if (!data.length) {
    return <p className="py-10 text-center text-sm text-muted">No activity yet.</p>;
  }
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid stroke="rgba(20,17,12,0.08)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6a6458" }} tickFormatter={(v) => String(v).slice(5)} />
          <YAxis tick={{ fontSize: 11, fill: "#6a6458" }} width={32} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e2dbcf", background: "#fffdf8" }}
            formatter={(v) => [v ?? 0, label]}
          />
          <Area type="monotone" dataKey={dataKey} stroke={teal} fill={teal} fillOpacity={0.18} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[20px] border border-border bg-surface p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p className="mt-2 font-display text-3xl tracking-tight text-fg">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export { ink };
