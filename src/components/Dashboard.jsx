import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { News } from "./Feed";
import { Profile } from "./Profile";
import { Roadmap } from "./Roadmap";
import useCarbonStore from "../stores/carbonStore";
import useNewsStore from "../stores/newsStore";
import useAuthStore from "../stores/authStore";
import LoadingSpinner from "./common/LoadingSpinner";
import { NewsCardSkeleton } from "./common/Skeleton";

export function DashboardLayout() {
  return <Outlet />;
}

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Header defaultTab="home">
        <Profile />
      </Header>

      <Body className="home">
        <WelcomeSection />
        <StatsGrid />
        <MainContent />
      </Body>
    </div>
  );
}

export function Body({ children, className }) {
  return <div className={`content ${className}`}>{children}</div>;
}

// Welcome Section with Quick Actions
function WelcomeSection() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="welcome-section">
      <div className="welcome-text">
        <h1>{getGreeting()}, {user?.firstName}!</h1>
        <p>Track your sustainability journey and carbon footprint</p>
      </div>
      <div className="quick-actions">
        <button className="action-btn primary" onClick={() => navigate("/carbon-entry")}>
          <span className="icon">➕</span>
          <span>Add Carbon Entry</span>
        </button>
        <button className="action-btn secondary" onClick={() => navigate("/sustainability-choices")}>
          <span className="icon">📚</span>
          <span>View Resources</span>
        </button>
      </div>
    </div>
  );
}

// Statistics Grid
function StatsGrid() {
  const { dashboard, fetchDashboard, isLoading } = useCarbonStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading) {
    return (
      <div className="stats-grid">
        <LoadingSpinner size="medium" text="Loading statistics..." />
      </div>
    );
  }

  // Calculate monthly average from monthlyTrend data
  const calculateMonthlyAverage = () => {
    if (!dashboard?.monthlyTrend || dashboard.monthlyTrend.length === 0) {
      return 0;
    }
    const total = dashboard.monthlyTrend.reduce((sum, month) => sum + (month.emissions || 0), 0);
    return Math.round(total / dashboard.monthlyTrend.length);
  };

  // Calculate goal progress from active goals
  const calculateGoalProgress = () => {
    if (!dashboard?.activeGoals || dashboard.activeGoals.length === 0) {
      return { progress: 0, message: "Set a goal" };
    }

    const goal = dashboard.activeGoals[0];
    if (goal.progress !== undefined) {
      return {
        progress: Math.round(goal.progress),
        message: goal.status === "completed" ? "Goal achieved!" : `${Math.round(goal.progress)}% complete`
      };
    }

    return { progress: 0, message: "In progress" };
  };

  // Determine emission trend
  const getEmissionTrend = () => {
    if (!dashboard?.monthlyTrend || dashboard.monthlyTrend.length < 2) {
      return { trend: "neutral", change: "No data yet" };
    }

    const lastMonth = dashboard.monthlyTrend[dashboard.monthlyTrend.length - 1]?.emissions || 0;
    const previousMonth = dashboard.monthlyTrend[dashboard.monthlyTrend.length - 2]?.emissions || 0;

    if (previousMonth === 0) {
      return { trend: "neutral", change: "Not enough data" };
    }

    const changePercent = ((lastMonth - previousMonth) / previousMonth * 100).toFixed(1);
    const trend = changePercent > 0 ? "up" : changePercent < 0 ? "down" : "neutral";

    return {
      trend,
      change: `${Math.abs(changePercent)}% ${trend === "up" ? "increase" : trend === "down" ? "decrease" : ""}`.trim()
    };
  };

  const emissionTrend = getEmissionTrend();
  const monthlyAverage = calculateMonthlyAverage();
  const goalData = calculateGoalProgress();

  const stats = [
    {
      id: 1,
      title: "Total Emissions",
      value: dashboard?.totalEmissions?.toLocaleString() || "0",
      unit: "kg CO₂",
      icon: "🌍",
      trend: emissionTrend.trend,
      change: emissionTrend.change,
      color: "#ef4444",
    },
    {
      id: 2,
      title: "Sustainability Level",
      value: dashboard?.roadmap?.currentLevel || "1",
      unit: "/3",
      icon: "⭐",
      trend: "up",
      change: dashboard?.roadmap?.currentLevel === 3 ? "Maximum level!" : "Keep improving",
      color: "#10b981",
    },
    {
      id: 3,
      title: "Monthly Average",
      value: monthlyAverage.toLocaleString(),
      unit: "kg CO₂",
      icon: "📊",
      trend: emissionTrend.trend,
      change: dashboard?.monthlyTrend?.length > 0
        ? `${dashboard.monthlyTrend.length} month${dashboard.monthlyTrend.length > 1 ? 's' : ''} tracked`
        : "Add entries to track",
      color: "#3b82f6",
    },
    {
      id: 4,
      title: "Goal Progress",
      value: goalData.progress,
      unit: "%",
      icon: "🎯",
      trend: goalData.progress > 50 ? "up" : "neutral",
      change: goalData.message,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

function StatCard({ stat }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
          {stat.icon}
        </span>
        <span className={`stat-trend ${stat.trend}`}>
          {stat.trend === "up" ? "↗" : stat.trend === "down" ? "↘" : "→"}
        </span>
      </div>
      <div className="stat-body">
        <h3 className="stat-title">{stat.title}</h3>
        <div className="stat-value">
          <span className="value">{stat.value}</span>
          <span className="unit">{stat.unit}</span>
        </div>
        <p className="stat-change" style={{ color: stat.color }}>
          {stat.change}
        </p>
      </div>
    </div>
  );
}

// Main Content - Roadmap and News
function MainContent() {
  return (
    <div className="main-content-grid">
      <RoadmapSection />
      <NewsSection />
    </div>
  );
}

function RoadmapSection() {
  const { roadmap, fetchRoadmap, isLoading } = useCarbonStore();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  const completedCount = roadmap?.milestones?.filter((m) => m.completed).length || 0;
  const progress = Math.round((completedCount / 6) * 100);

  return (
    <div className="roadmap-section card">
      <div className="section-header">
        <div>
          <h2>Sustainability Roadmap</h2>
          <p className="section-subtitle">
            {completedCount} of 6 milestones completed ({progress}%)
          </p>
        </div>
        <button
          className="toggle-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "View Details"}
        </button>
      </div>

      <div className="roadmap-visual">
        {isLoading ? (
          <LoadingSpinner size="small" />
        ) : (
          <>
            <Roadmap count={6} completed={completedCount - 1} />
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </>
        )}
      </div>

      {showDetails && roadmap?.milestones && (
        <div className="milestone-list">
          {roadmap.milestones.map((milestone, idx) => (
            <div key={idx} className={`milestone-item ${milestone.completed ? 'completed' : ''}`}>
              <span className="milestone-check">
                {milestone.completed ? "✓" : idx + 1}
              </span>
              <div className="milestone-info">
                <p className="milestone-title">{milestone.title}</p>
                <p className="milestone-desc">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewsSection() {
  const { news, fetchNews, isLoading } = useNewsStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews({ limit: 3 });
  }, [fetchNews]);

  return (
    <div className="news-section-dashboard card">
      <div className="section-header">
        <div>
          <h2>Latest Sustainability News</h2>
          <p className="section-subtitle">Stay updated with the latest trends</p>
        </div>
        <button className="view-all-btn" onClick={() => navigate("/news")}>
          View All →
        </button>
      </div>

      <div className="news-grid-dashboard">
        {isLoading ? (
          <>
            <NewsCardSkeleton />
            <NewsCardSkeleton />
            <NewsCardSkeleton />
          </>
        ) : news.length > 0 ? (
          news.map((article) => (
            <News
              key={article._id}
              news={{
                _id: article._id,
                slug: article.slug,
                image: article.imageUrl || `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1611273426858-450d8e3c9fce' : '1569163139394-79a1ce873e4e'}?w=600&h=400&fit=crop`,
                content: article.summary || article.content,
                title: article.title,
                category: article.category || "Sustainability",
              }}
            />
          ))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <span className="empty-icon">📰</span>
            <p>No news available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
