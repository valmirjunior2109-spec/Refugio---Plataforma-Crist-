import type { PlanCover as Cover } from "@/types/content";
import { cn } from "@/lib/utils/cn";

const tones: Record<Cover["tone"], { bg: string; fg: string; accent: string }> = {
  sage: { bg: "#668773", fg: "#F7F5EF", accent: "#A9C0B0" },
  sand: { bg: "#E9E4D7", fg: "#34463B", accent: "#C9BFA6" },
  deep: { bg: "#34463B", fg: "#E9E4D7", accent: "#668773" },
  ivory: { bg: "#F1EEE4", fg: "#668773", accent: "#D9D2BF" },
};

/** Capa ilustrada de plano de leitura, gerada em SVG com a paleta da marca. */
export function PlanCover({ cover, className, title }: { cover: Cover; className?: string; title?: string }) {
  const t = tones[cover.tone] ?? tones.sage;
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block h-full w-full", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="320" height="200" fill={t.bg} />
      <Motif motif={cover.motif} fg={t.fg} accent={t.accent} />
    </svg>
  );
}

function Motif({ motif, fg, accent }: { motif: Cover["motif"]; fg: string; accent: string }) {
  const stroke = { fill: "none", stroke: fg, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (motif) {
    case "arch":
      return (
        <g>
          <path d="M110 200V112a50 50 0 0 1 100 0v88" {...stroke} />
          <path d="M132 200v-82a28 28 0 0 1 56 0v82" fill={accent} opacity="0.55" />
          <circle cx="160" cy="128" r="7" fill={fg} />
        </g>
      );
    case "sun":
      return (
        <g>
          <circle cx="160" cy="150" r="46" fill={accent} opacity="0.7" />
          <path d="M40 150h240" {...stroke} />
          <path d="M70 172h180M105 190h110" {...stroke} opacity="0.6" />
          {[-60, -30, 0, 30, 60].map((a) => (
            <line
              key={a}
              x1={160 + Math.sin((a * Math.PI) / 180) * 62}
              y1={150 - Math.cos((a * Math.PI) / 180) * 62}
              x2={160 + Math.sin((a * Math.PI) / 180) * 80}
              y2={150 - Math.cos((a * Math.PI) / 180) * 80}
              {...stroke}
            />
          ))}
        </g>
      );
    case "waves":
      return (
        <g>
          {[70, 105, 140, 175].map((y, i) => (
            <path
              key={y}
              d={`M-10 ${y} C 40 ${y - 18}, 80 ${y + 18}, 130 ${y} S 220 ${y - 18}, 270 ${y} S 330 ${y + 10}, 340 ${y}`}
              {...stroke}
              opacity={1 - i * 0.18}
            />
          ))}
          <circle cx="248" cy="40" r="14" fill={accent} />
        </g>
      );
    case "leaf":
      return (
        <g>
          <path d="M160 180C110 150 108 80 160 30c52 50 50 120 0 150Z" fill={accent} opacity="0.6" />
          <path d="M160 190V40" {...stroke} />
          {[70, 100, 130].map((y) => (
            <g key={y}>
              <path d={`M160 ${y + 20} L130 ${y}`} {...stroke} />
              <path d={`M160 ${y + 20} L190 ${y}`} {...stroke} />
            </g>
          ))}
        </g>
      );
    case "path":
      return (
        <g>
          <path d="M60 200C110 160 220 160 170 120S120 70 180 40" {...stroke} strokeWidth={14} stroke={accent} />
          <path d="M60 200C110 160 220 160 170 120S120 70 180 40" {...stroke} strokeDasharray="2 14" />
          <circle cx="180" cy="40" r="9" fill={fg} />
          <path d="M20 60 60 30l40 30M220 90l40-30 40 30" {...stroke} opacity="0.5" />
        </g>
      );
    case "stars":
      return (
        <g>
          {[
            [70, 60, 5],
            [120, 110, 3],
            [190, 50, 6],
            [250, 100, 4],
            [100, 160, 4],
            [230, 160, 3],
            [160, 140, 2.5],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? accent : fg} />
          ))}
          <path d="M70 60 120 110 190 50 250 100" {...stroke} strokeWidth={1.5} opacity="0.6" />
        </g>
      );
  }
}
