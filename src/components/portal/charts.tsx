import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ink = "#0A0A0A";
const zinc = "#A1A1AA";

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
          <CartesianGrid stroke="rgba(10,10,10,0.08)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#52525B" }} tickFormatter={(v) => String(v).slice(5)} />
          <YAxis tick={{ fontSize: 11, fill: "#52525B" }} width={32} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #E4E4E7", background: "#FFFFFF" }}
            formatter={(v) => [v ?? 0, label]}
          />
          <Area type="monotone" dataKey={dataKey} stroke={ink} fill={zinc} fillOpacity={0.22} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="surface-card p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-subtle">{label}</p>
      <p className="mt-2 font-display text-3xl tracking-tight text-fg">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export { ink };
