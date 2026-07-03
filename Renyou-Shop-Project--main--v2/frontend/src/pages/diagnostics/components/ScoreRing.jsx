export default function ScoreRing({ score }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const hue =
    score >= 85
      ? "#f9a8d4"
      : score >= 70
      ? "#fcd34d"
      : "#fca5a5";

  return (
    <div
      style={{
        position: "relative",
        width: 136,
        height: 136,
        margin: "0 auto 1.25rem",
      }}
    >
      <svg
        width="136"
        height="136"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="68"
          cy="68"
          r={r}
          fill="none"
          stroke="rgba(244,114,182,0.12)"
          strokeWidth="8"
        />

        <circle
          cx="68"
          cy="68"
          r={r}
          fill="none"
          stroke={hue}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition:
              "stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)",
            filter: `drop-shadow(0 0 10px ${hue}99)`,
          }}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 34,
            fontWeight: 600,
            color: "#fff",
            lineHeight: 1,
          }}
        >
          {score}
        </span>

        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            color: "rgba(255,200,220,0.55)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          score
        </span>
      </div>
    </div>
  );
}