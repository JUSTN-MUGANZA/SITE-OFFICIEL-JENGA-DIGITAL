/** Petite courbe en aire dessinée côté serveur (aucune bibliothèque). */
export function AreaChart({ points, label }: { points: { day: Date; count: number }[]; label: string }) {
  const W = 640;
  const H = 200;
  const pad = { top: 12, right: 8, bottom: 26, left: 30 };
  const max = Math.max(4, ...points.map((p) => p.count));
  const step = Math.ceil(max / 4);
  const top = step * 4;
  const x = (i: number) => pad.left + (i / Math.max(1, points.length - 1)) * (W - pad.left - pad.right);
  const y = (v: number) => pad.top + (1 - v / top) * (H - pad.top - pad.bottom);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(p.count).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1)} ${y(0)} L${x(0)} ${y(0)} Z`;
  const fmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" });
  const ticks = [0, Math.floor((points.length - 1) / 3), Math.floor(((points.length - 1) * 2) / 3), points.length - 1];
  const total = points.reduce((s, p) => s + p.count, 0);

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label} : ${total} au total`}>
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0052ff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#0052ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map((k) => (
          <g key={k}>
            <line x1={pad.left} x2={W - pad.right} y1={y(k * step)} y2={y(k * step)} stroke="#dfe3f3" strokeDasharray={k ? "4 4" : undefined} />
            <text x={pad.left - 8} y={y(k * step) + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">
              {k * step}
            </text>
          </g>
        ))}
        <path d={area} fill="url(#area-fill)" />
        <path d={line} fill="none" stroke="#0052ff" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) =>
          p.count > 0 ? (
            <circle key={i} cx={x(i)} cy={y(p.count)} r="3.5" fill="#fff" stroke="#0052ff" strokeWidth="2">
              <title>{`${fmt.format(p.day)} : ${p.count}`}</title>
            </circle>
          ) : null,
        )}
        {ticks.map((i) => (
          <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"} className="fill-muted-foreground text-[10px]">
            {fmt.format(points[i].day)}
          </text>
        ))}
      </svg>
    </figure>
  );
}
