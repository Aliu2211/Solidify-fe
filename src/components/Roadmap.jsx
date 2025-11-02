export function Roadmap({
  count = 6, // number of milestones
  completed = 0, // index of last completed step (0-based)
}) {
  const milestones = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    isCompleted: i <= completed,
    isActive: i === completed + 1,
  }));

  return (
    <div className="roadmap-progress-indicator">
      <div className="roadmap-line-container">
        {/* Background line */}
        <div className="roadmap-line-bg"></div>
        {/* Progress line */}
        <div
          className="roadmap-line-progress"
          style={{
            width: `${(completed / (count - 1)) * 100}%`
          }}
        ></div>
      </div>

      {/* Milestone dots */}
      <div className="roadmap-dots-container">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`roadmap-dot-wrapper ${
              milestone.isCompleted ? 'completed' : ''
            } ${milestone.isActive ? 'active' : ''}`}
            style={{
              left: `${(index / (count - 1)) * 100}%`
            }}
          >
            <div className="roadmap-dot">
              {milestone.isCompleted && (
                <svg
                  className="roadmap-check"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
              {!milestone.isCompleted && <span>{milestone.id}</span>}
            </div>
            <div className="roadmap-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
