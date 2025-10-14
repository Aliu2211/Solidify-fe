// copied from gpt
// will fix later
export function Roadmap({
  count = 6, // number of dots
  completed = 0, // index of last completed step (0-based)
  dot = 28, // dot diameter (px)
  line = 6, // line thickness (px)
  dashRatio = 0.75, // 0..1, portion of each gap that is solid
  lineColor = "#fff",
  dotColor = "#a29090ff",
}) {
  const style = {
    "--steps": count,
    "--dot": `${dot}px`,
    "--line-h": `${line}px`,
    "--dash-ratio": dashRatio,
    "--line-color": lineColor,
    "--dot-color": dotColor,
  };

  return (
    <div className="rm" style={style}>
      <ul className="rm-dots">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className={`rm-dot${i <= completed ? " done" : ""}`} />
        ))}
      </ul>
    </div>
  );
}
