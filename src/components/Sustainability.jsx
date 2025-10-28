import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Body } from "./Dashboard";
import { Header } from "./Header";
import { Profile } from "./Profile";
import { Contents } from "./Contents";
import useKnowledgeStore from "../stores/knowledgeStore";
import useCourseStore from "../stores/courseStore";
import { NewsGridSkeleton } from "./common/Skeleton";
import toast from "react-hot-toast";

export default function Sustainability() {
  const { articles, fetchArticles, searchArticles, isLoading: articlesLoading } = useKnowledgeStore();
  const { courses, myProgress, fetchCourses, fetchMyProgress, isLoading: coursesLoading } = useCourseStore();
  const [activeTab, setActiveTab] = useState("courses"); // "courses" or "knowledge"
  const [levels, setLevels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const debounceTimer = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch all knowledge articles
    fetchArticles({ limit: 50 });
    // Fetch courses
    fetchCourses();
    // Fetch my progress
    fetchMyProgress();
  }, [fetchArticles, fetchCourses, fetchMyProgress]);

  // Handle hash navigation (from search results)
  useEffect(() => {
    if (location.hash) {
      const slug = location.hash.substring(1); // Remove the #
      setTimeout(() => {
        const element = document.getElementById(slug);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("highlight-article");
          setTimeout(() => element.classList.remove("highlight-article"), 2000);
        }
      }, 300); // Wait for content to render
    }
  }, [location.hash, articles]);

  // Backend search with debouncing
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchArticles(query, { limit: 50 });
      setSearchResults(results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchArticles]);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.trim()) {
      debounceTimer.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, performSearch]);

  useEffect(() => {
    // Use search results if searching, otherwise use all articles
    const articlesToGroup = searchQuery.trim() && searchResults.length > 0
      ? searchResults
      : articles;

    // Group articles by sustainability level
    if (articlesToGroup && articlesToGroup.length > 0) {
      const levelData = [
        {
          id: 1,
          title: "Foundation & Measurement",
          level: "foundation",
          message:
            "Start your sustainability journey with essential knowledge and measurement tools. Learn the basics of carbon tracking, emission scopes, and foundational practices for SMEs.",
          articles: articlesToGroup.filter((a) => a.sustainabilityLevel === 1 || a.level === "foundation"),
        },
        {
          id: 2,
          title: "Efficiency and Integration",
          level: "efficiency",
          message:
            "Enhance your operations with advanced efficiency strategies. Explore integration techniques, optimization methods, and tools to improve your carbon management.",
          articles: articlesToGroup.filter((a) => a.sustainabilityLevel === 2 || a.level === "efficiency"),
        },
        {
          id: 3,
          title: "Transformation & Net Zero Leadership",
          level: "transformation",
          message:
            "Lead the transformation toward Net Zero. Discover cutting-edge approaches, leadership strategies, and comprehensive solutions for achieving carbon neutrality.",
          articles: articlesToGroup.filter((a) => a.sustainabilityLevel === 3 || a.level === "transformation"),
        },
      ];

      setLevels(levelData);
    }
  }, [articles, searchQuery, searchResults]);

  const isLoading = articlesLoading || coursesLoading;

  if (isLoading && courses.length === 0 && articles.length === 0) {
    return (
      <div className="sustainability-page">
        <Header defaultTab="relax">
          <Profile />
        </Header>
        <Body className="sustainability">
          <PageHeaderSkeleton />
          <NewsGridSkeleton count={6} />
        </Body>
      </div>
    );
  }

  return (
    <div className="sustainability-page">
      <Header defaultTab="relax">
        <Profile />
      </Header>

      <Body className="sustainability">
        {/* Modern Page Header */}
        <PageHeader
          totalArticles={articles.length}
          totalCourses={courses.length}
          myProgress={myProgress}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === "courses" ? (
          <CoursesContent
            courses={courses}
            myProgress={myProgress}
            onCourseClick={(course) => {
              setSelectedCourse(course);
              setShowCourseModal(true);
            }}
          />
        ) : (
          <>
            {/* Knowledge Levels Content */}
            {levels.length > 0 ? (
              <Contents levels={levels} searchQuery={searchQuery} isSearching={isSearching} />
            ) : searchQuery.trim() && !isSearching ? (
              <NoSearchResults searchQuery={searchQuery} />
            ) : (
              <EmptyState />
            )}
          </>
        )}

        {/* Course Detail Modal */}
        {showCourseModal && selectedCourse && (
          <CourseModal
            course={selectedCourse}
            myProgress={myProgress}
            onClose={() => {
              setShowCourseModal(false);
              setSelectedCourse(null);
            }}
          />
        )}
      </Body>
    </div>
  );
}

// Modern Page Header Component
function PageHeader({ totalArticles, totalCourses, myProgress, searchQuery, setSearchQuery, isSearching, activeTab, setActiveTab }) {
  return (
    <div className="knowledge-page-header">
      <div className="knowledge-header-content">
        <div className="knowledge-title-section">
          <h1 className="knowledge-page-title">Sustainability Learning Center</h1>
          <p className="knowledge-page-subtitle">
            Master sustainability through structured courses and comprehensive knowledge resources
          </p>
        </div>

        <div className="knowledge-stats">
          <div className="knowledge-stat-card">
            <span className="stat-icon">🎓</span>
            <div>
              <p className="stat-value">{totalCourses}</p>
              <p className="stat-label">Courses</p>
            </div>
          </div>
          <div className="knowledge-stat-card">
            <span className="stat-icon">📚</span>
            <div>
              <p className="stat-value">{totalArticles}</p>
              <p className="stat-label">Articles</p>
            </div>
          </div>
          {myProgress && (
            <div className="knowledge-stat-card highlight">
              <span className="stat-icon">📊</span>
              <div>
                <p className="stat-value">{myProgress.completedCourses?.length || 0}</p>
                <p className="stat-label">Completed</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sustainability-tabs">
        <button
          className={`tab-button ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          <span className="material-symbols-outlined">school</span>
          Learning Courses
        </button>
        <button
          className={`tab-button ${activeTab === "knowledge" ? "active" : ""}`}
          onClick={() => setActiveTab("knowledge")}
        >
          <span className="material-symbols-outlined">menu_book</span>
          Knowledge Base
        </button>
      </div>

      {/* Search Bar - Only show for knowledge tab */}
      {activeTab === "knowledge" && (
        <div className="knowledge-search-container">
          <div className="knowledge-search-wrapper">
            <span className="search-icon">{isSearching ? "⏳" : "🔍"}</span>
            <input
              type="text"
              placeholder="Search articles by title, content, summary, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="knowledge-search-input"
            />
            {searchQuery && !isSearching && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          {isSearching && (
            <p className="search-status-text">Searching...</p>
          )}
        </div>
      )}
    </div>
  );
}

// No Search Results Component
function NoSearchResults({ searchQuery }) {
  return (
    <div className="knowledge-empty-state">
      <div className="empty-state-content">
        <span className="empty-state-icon">🔍</span>
        <h3>No Results Found</h3>
        <p>
          No articles found matching "<strong>{searchQuery}</strong>".
          Try different keywords or browse all articles.
        </p>
      </div>
    </div>
  );
}

// Page Header Skeleton
function PageHeaderSkeleton() {
  return (
    <div className="knowledge-page-header" style={{ opacity: 0.6 }}>
      <div className="knowledge-header-content">
        <div className="knowledge-title-section">
          <div
            style={{
              height: "36px",
              width: "400px",
              background: "#e5e7eb",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          />
          <div
            style={{
              height: "20px",
              width: "500px",
              background: "#e5e7eb",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="knowledge-empty-state">
      <div className="empty-state-content">
        <span className="empty-state-icon">📚</span>
        <h3>No Knowledge Articles Available</h3>
        <p>
          The knowledge base is currently being updated. Check back soon for
          sustainability insights and resources.
        </p>
      </div>
    </div>
  );
}

// Courses Content Component
function CoursesContent({ courses, myProgress, onCourseClick }) {
  const currentLevel = myProgress?.currentLevel || 1;

  // Group courses by level
  const coursesByLevel = {
    1: courses.filter((c) => c.level === 1),
    2: courses.filter((c) => c.level === 2),
    3: courses.filter((c) => c.level === 3),
  };

  // Calculate completion for current level
  const currentLevelCourses = coursesByLevel[currentLevel];
  const completedInCurrentLevel = currentLevelCourses.filter((course) => {
    // Check if course is in completedCourses array
    const isCompleted = myProgress?.completedCourses?.find(
      (cp) => cp.course?._id === course._id || cp.course === course._id
    );
    return !!isCompleted;
  }).length;
  const totalInCurrentLevel = currentLevelCourses.length;
  const currentLevelProgress = totalInCurrentLevel > 0
    ? Math.round((completedInCurrentLevel / totalInCurrentLevel) * 100)
    : 0;

  const levelInfo = {
    1: {
      title: "Level 1: Foundation & Measurement",
      description: "Start your sustainability journey with essential knowledge",
      color: "#22c55e",
      icon: "🌱",
    },
    2: {
      title: "Level 2: Efficiency & Integration",
      description: "Enhance operations with advanced efficiency strategies",
      color: "#3b82f6",
      icon: "⚡",
    },
    3: {
      title: "Level 3: Transformation & Net Zero",
      description: "Lead the transformation toward Net Zero",
      color: "#8b5cf6",
      icon: "🚀",
    },
  };

  return (
    <div className="courses-container">
      {/* Progress Overview */}
      {myProgress && (
        <div className="course-progress-overview">
          <div className="progress-header">
            <div>
              <h3 className="progress-title">Your Learning Journey</h3>
              <p className="progress-subtitle">
                Current Level: {currentLevel} • Level Progress: {currentLevelProgress}%
              </p>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${currentLevelProgress}%` }}
              ></div>
            </div>
          </div>
          {currentLevelProgress === 100 && currentLevel < 3 && (
            <div className="level-complete-message">
              🎉 Congratulations! You've completed Level {currentLevel}. Complete all courses to unlock Level {currentLevel + 1}!
            </div>
          )}
        </div>
      )}

      {/* Current Level Courses */}
      <div className="course-level-section current-level">
        <div className="course-level-header">
          <div className="level-header-content">
            <span className="level-icon" style={{ background: `${levelInfo[currentLevel].color}20` }}>
              {levelInfo[currentLevel].icon}
            </span>
            <div>
              <h2 className="level-title" style={{ color: levelInfo[currentLevel].color }}>
                {levelInfo[currentLevel].title}
              </h2>
              <p className="level-description">{levelInfo[currentLevel].description}</p>
            </div>
          </div>
          <div className="level-stats">
            <span className="level-count">
              {completedInCurrentLevel} / {totalInCurrentLevel} completed
            </span>
          </div>
        </div>

        <div className="courses-grid">
          {coursesByLevel[currentLevel].length > 0 ? (
            coursesByLevel[currentLevel].map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                myProgress={myProgress}
                onClick={() => onCourseClick(course)}
                levelColor={levelInfo[currentLevel].color}
              />
            ))
          ) : (
            <div className="no-courses-message">
              <p>No courses available at this level yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Locked Levels - Show next level preview */}
      {currentLevel < 3 && (
        <div className="course-level-section locked-level">
          <div className="course-level-header">
            <div className="level-header-content">
              <span className="level-icon locked" style={{ background: `${levelInfo[currentLevel + 1].color}20` }}>
                🔒
              </span>
              <div>
                <h2 className="level-title locked-title" style={{ color: levelInfo[currentLevel + 1].color }}>
                  {levelInfo[currentLevel + 1].title}
                </h2>
                <p className="level-description">Complete Level {currentLevel} to unlock this level</p>
              </div>
            </div>
            <div className="level-stats">
              <span className="level-count locked">
                {coursesByLevel[currentLevel + 1].length} courses locked
              </span>
            </div>
          </div>
          <div className="locked-courses-preview">
            {coursesByLevel[currentLevel + 1].slice(0, 3).map((course) => (
              <div key={course._id} className="locked-course-card">
                <div className="locked-overlay">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div className="course-info-locked">
                  <h4>{course.title}</h4>
                  <p className="course-duration">
                    <span className="material-symbols-outlined">schedule</span>
                    {course.duration} mins
                  </p>
                </div>
              </div>
            ))}
            {coursesByLevel[currentLevel + 1].length > 3 && (
              <div className="locked-course-card more-courses">
                <div className="more-courses-text">
                  +{coursesByLevel[currentLevel + 1].length - 3} more courses
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Course Card Component
function CourseCard({ course, myProgress, onClick, levelColor }) {
  // Find if user has progress on this course
  const courseProgress = myProgress?.coursesInProgress?.find(
    (cp) => cp.course?._id === course._id
  ) || myProgress?.completedCourses?.find(
    (cp) => cp.course?._id === course._id
  );

  const isCompleted = courseProgress?.status === "completed";
  const isInProgress = courseProgress?.status === "in_progress";

  const getStatusInfo = () => {
    if (isCompleted) return {
      icon: "check_circle",
      color: "#22c55e",
      bgColor: "#dcfce7",
      label: "Completed",
      buttonText: "Review Course"
    };
    if (isInProgress) return {
      icon: "schedule",
      color: "#f59e0b",
      bgColor: "#fef3c7",
      label: "In Progress",
      buttonText: "Continue Learning"
    };
    return {
      icon: "play_circle",
      color: "#3b82f6",
      bgColor: "#dbeafe",
      label: "Not Started",
      buttonText: "Start Course"
    };
  };

  const statusInfo = getStatusInfo();
  const progressPercentage = isInProgress && courseProgress?.timeSpent
    ? Math.min(Math.round((courseProgress.timeSpent / course.duration) * 100), 100)
    : 0;

  return (
    <div
      className={`course-card ${isCompleted ? "completed" : ""} ${isInProgress ? "in-progress" : ""}`}
      onClick={onClick}
      style={{ '--level-color': levelColor }}
    >
      {/* Status Badge - Top Right */}
      <div className="course-status-badge-top" style={{
        background: statusInfo.bgColor,
        color: statusInfo.color
      }}>
        <span className="material-symbols-outlined">{statusInfo.icon}</span>
        <span className="status-label">{statusInfo.label}</span>
      </div>

      {/* Thumbnail Section */}
      <div className="course-card-header">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="course-thumbnail-img" />
        ) : (
          <div className="course-thumbnail-placeholder" style={{
            background: `linear-gradient(135deg, ${levelColor}15 0%, ${levelColor}25 100%)`
          }}>
            <span className="material-symbols-outlined" style={{ color: levelColor }}>
              school
            </span>
          </div>
        )}

        {/* Progress Overlay for In-Progress Courses */}
        {isInProgress && progressPercentage > 0 && (
          <div className="thumbnail-progress-overlay">
            <div className="circular-progress">
              <svg width="60" height="60">
                <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4"/>
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - progressPercentage / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 30 30)"
                />
              </svg>
              <span className="progress-text">{progressPercentage}%</span>
            </div>
          </div>
        )}

        {/* Completion Badge for Completed Courses */}
        {isCompleted && (
          <div className="completion-badge-overlay">
            <div className="completion-badge">
              <span className="material-symbols-outlined">verified</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="course-card-body">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>

        {/* Meta Information */}
        <div className="course-meta">
          <div className="course-meta-item">
            <span className="material-symbols-outlined">schedule</span>
            <span>{course.duration} min</span>
          </div>
          <div className="course-meta-item">
            <span className="material-symbols-outlined">
              {course.completionCriteria?.type === "quiz" ? "quiz" :
               course.completionCriteria?.type === "assessment" ? "assignment" : "article"}
            </span>
            <span>{course.completionCriteria?.type || "read"}</span>
          </div>
          {isCompleted && courseProgress?.quizScore && (
            <div className="course-meta-item score">
              <span className="material-symbols-outlined">star</span>
              <span>{courseProgress.quizScore}%</span>
            </div>
          )}
        </div>

        {/* Progress Bar for In-Progress Courses */}
        {isInProgress && progressPercentage > 0 && (
          <div className="course-progress-section">
            <div className="progress-info">
              <span className="progress-label">Progress</span>
              <span className="progress-percentage">{progressPercentage}%</span>
            </div>
            <div className="course-progress-bar">
              <div
                className="course-progress-fill"
                style={{
                  width: `${progressPercentage}%`,
                  background: levelColor
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="course-card-footer">
        <button className="course-action-btn" style={{ background: levelColor }}>
          <span className="btn-text">{statusInfo.buttonText}</span>
          <span className="material-symbols-outlined btn-icon">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

// Course Modal Component
function CourseModal({ course, myProgress, onClose }) {
  const { startCourse, completeCourse } = useCourseStore();
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [quizScore, setQuizScore] = useState("");

  const courseProgress = myProgress?.coursesInProgress?.find(
    (cp) => cp.course?._id === course._id
  ) || myProgress?.completedCourses?.find(
    (cp) => cp.course?._id === course._id
  );

  const isCompleted = courseProgress?.status === "completed";
  const isInProgress = courseProgress?.status === "in_progress";

  const handleStart = async () => {
    setIsStarting(true);
    const response = await startCourse(course._id);
    setIsStarting(false);

    if (response.success) {
      toast.success("Course started! Good luck with your learning journey.");
    } else {
      toast.error(response.message || "Failed to start course");
    }
  };

  const handleComplete = async () => {
    if (course.completionCriteria?.type !== "read" && !quizScore) {
      toast.error("Please enter your quiz score");
      return;
    }

    setIsCompleting(true);
    const data = {
      timeSpent: course.duration,
    };

    if (course.completionCriteria?.type !== "read") {
      data.quizScore = parseInt(quizScore);
    }

    const response = await completeCourse(course._id, data);
    setIsCompleting(false);

    if (response.success) {
      // Check if level was upgraded
      if (response.levelUpgraded) {
        toast.success(
          `🎉 Amazing! Course completed AND you've been upgraded to Level ${response.newLevel}!`,
          { duration: 5000 }
        );
      } else {
        toast.success("🎉 Congratulations! Course completed successfully!");
      }
      onClose();
    } else {
      toast.error(response.message || "Failed to complete course");
    }
  };

  return (
    <div className="course-modal-overlay" onClick={onClose}>
      <div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="course-modal-header">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="modal-course-thumbnail" />
          ) : (
            <div className="modal-course-thumbnail-placeholder">
              <span className="material-symbols-outlined">school</span>
            </div>
          )}
          <div className="modal-header-content">
            <h2 className="modal-course-title">{course.title}</h2>
            <div className="modal-course-meta">
              <span className="meta-badge">
                <span className="material-symbols-outlined">schedule</span>
                {course.duration} minutes
              </span>
              <span className="meta-badge">
                <span className="material-symbols-outlined">signal_cellular_alt</span>
                Level {course.level}
              </span>
              <span className="meta-badge">
                <span className="material-symbols-outlined">
                  {course.completionCriteria?.type === "quiz" ? "quiz" : "article"}
                </span>
                {course.completionCriteria?.type || "read"}
              </span>
              {isCompleted && (
                <span className="meta-badge completed">
                  <span className="material-symbols-outlined">check_circle</span>
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="course-modal-body">
          <div className="course-description-section">
            <h3>Course Description</h3>
            <p>{course.description}</p>
          </div>

          {course.completionCriteria && (
            <div className="completion-criteria-section">
              <h3>Completion Requirements</h3>
              <div className="criteria-info">
                {course.completionCriteria.type === "read" ? (
                  <p>
                    <span className="material-symbols-outlined">schedule</span>
                    Complete the reading (minimum {course.completionCriteria.requiredTime || course.duration} minutes)
                  </p>
                ) : (
                  <p>
                    <span className="material-symbols-outlined">quiz</span>
                    Pass the {course.completionCriteria.type} with a score of {course.completionCriteria.passingScore}% or higher
                  </p>
                )}
              </div>
            </div>
          )}

          {course.resources && course.resources.length > 0 && (
            <div className="course-resources-section">
              <h3>Additional Resources</h3>
              <div className="resources-list">
                {course.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    <span className="material-symbols-outlined">
                      {resource.type === "pdf" ? "picture_as_pdf" : resource.type === "video" ? "play_circle" : "link"}
                    </span>
                    {resource.title}
                    <span className="material-symbols-outlined">open_in_new</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {isInProgress && !isCompleted && course.completionCriteria?.type !== "read" && (
            <div className="quiz-score-section">
              <label htmlFor="quiz-score">Enter your score:</label>
              <input
                id="quiz-score"
                type="number"
                min="0"
                max="100"
                value={quizScore}
                onChange={(e) => setQuizScore(e.target.value)}
                placeholder="Enter score (0-100)"
                className="quiz-score-input"
              />
            </div>
          )}
        </div>

        <div className="course-modal-footer">
          {!isInProgress && !isCompleted ? (
            <button className="btn-start-course" onClick={handleStart} disabled={isStarting}>
              {isStarting ? "Starting..." : "Start Course"}
              <span className="material-symbols-outlined">play_arrow</span>
            </button>
          ) : isInProgress && !isCompleted ? (
            <button className="btn-complete-course" onClick={handleComplete} disabled={isCompleting}>
              {isCompleting ? "Submitting..." : "Mark as Complete"}
              <span className="material-symbols-outlined">check_circle</span>
            </button>
          ) : (
            <div className="completion-summary">
              <span className="material-symbols-outlined">celebration</span>
              <p>You completed this course{courseProgress?.quizScore ? ` with a score of ${courseProgress.quizScore}%` : ""}!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
