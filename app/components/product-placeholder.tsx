type ProductPlaceholderProps = {
  name: string;
  category: string;
  compact?: boolean;
  className?: string;
};

type Colours = { petal: string; centre: string; leaf: string };

const leaf = "#87A96B";

// Colours come from the piece's own name, so a red hibiscus is drawn red and a jasmine white.
const palettes: Array<[RegExp, Colours]> = [
  [/hibiscus|rose|cherry|watermelon/i, { petal: "#B8473A", centre: "#F2C14E", leaf }],
  [/jasmine|white|daisy|bunny|clips/i, { petal: "#FBF8F1", centre: "#D5851F", leaf }],
  [/sunflower|golden|marigold|bumblebee|swastik|shree/i, { petal: "#E0A030", centre: "#5A3E2B", leaf }],
  [/lavender|iris/i, { petal: "#8F86B0", centre: "#F2C14E", leaf }],
  [/lotus|tulip|pink/i, { petal: "#E79AAE", centre: "#F2C14E", leaf }],
  [/leaf|leafy|green/i, { petal: "#87A96B", centre: "#F2C14E", leaf: "#5E7A48" }],
];

function coloursFor(name: string): Colours {
  return palettes.find(([pattern]) => pattern.test(name))?.[1] ?? { petal: "#D5851F", centre: "#5A3E2B", leaf };
}

function Flower({ cx, cy, r, colours, petals = 8 }: { cx: number; cy: number; r: number; colours: Colours; petals?: number }) {
  return (
    <g>
      {Array.from({ length: petals }, (_, index) => (
        <ellipse
          key={index}
          cx={cx}
          cy={cy - r * 0.62}
          rx={r * 0.34}
          ry={r * 0.58}
          fill={colours.petal}
          stroke="#5A3E2B"
          strokeOpacity={0.18}
          strokeWidth={r * 0.04}
          transform={`rotate(${(360 / petals) * index} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.32} fill={colours.centre} />
    </g>
  );
}

function Drawing({ name, category }: { name: string; category: string }) {
  const colours = coloursFor(name);
  const isStrand = /garland|mala|necklace|toran|hanging/i.test(`${category} ${name}`);

  if (isStrand) {
    const points = [20, 35, 50, 65, 80].map((x) => ({ x, y: 30 + 26 * Math.sin(((x - 20) / 60) * Math.PI) }));
    return (
      <g transform="translate(0 16)">
        <path d="M8 22 Q50 92 92 22" fill="none" stroke="#5A3E2B" strokeWidth={1.4} strokeLinecap="round" />
        {points.map((point, index) => (
          <g key={index}>
            <ellipse cx={point.x + 5} cy={point.y + 6} rx={3} ry={6} fill={colours.leaf} transform={`rotate(-30 ${point.x + 5} ${point.y + 6})`} />
            <Flower cx={point.x} cy={point.y} r={8.5} colours={colours} petals={7} />
          </g>
        ))}
      </g>
    );
  }

  return (
    <>
      {/lamp/i.test(name) ? <circle cx={50} cy={38} r={40} fill="#F6D9A0" /> : null}
      <path d="M50 54 C49 70 52 82 50 96" fill="none" stroke={colours.leaf} strokeWidth={3} strokeLinecap="round" />
      <ellipse cx={39} cy={76} rx={6} ry={12} fill={colours.leaf} transform="rotate(-48 39 76)" />
      <ellipse cx={61} cy={70} rx={6} ry={12} fill={colours.leaf} transform="rotate(48 61 70)" />
      <Flower cx={50} cy={38} r={26} colours={colours} petals={/sunflower|daisy/i.test(name) ? 14 : 8} />
    </>
  );
}

export function ProductPlaceholder({ name, category, compact = false, className = "" }: ProductPlaceholderProps) {
  return (
    <div
      className={`product-placeholder ${compact ? "product-placeholder-compact" : ""} ${className}`}
      role="img"
      aria-label={`Drawing of the ${name}`}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <Drawing name={name} category={category} />
      </svg>
    </div>
  );
}
