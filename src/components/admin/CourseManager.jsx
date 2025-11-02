import { useEffect, useState } from 'react';
import useAdminStore from '../../stores/adminStore';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * CourseManager Component
 * Manage courses with full CRUD operations
 */
export default function CourseManager() {
  const { courses, coursesLoading, fetchCourses, createCourse, updateCourse, deleteCourse } = useAdminStore();

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    level: 1,
    orderInLevel: 1,
    duration: 60,
    thumbnail: '',
    completionCriteria: {
      type: 'read',
      passingScore: 0,
      requiredTime: 0,
    },
    resources: [],
  });

  useEffect(() => {
    // Stagger API calls to prevent rate limiting (0ms delay for first manager)
    const timer = setTimeout(() => {
      fetchCourses();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData(course);
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        content: '',
        level: 1,
        orderInLevel: 1,
        duration: 60,
        thumbnail: '',
        completionCriteria: {
          type: 'read',
          passingScore: 0,
          requiredTime: 0,
        },
        resources: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show user-friendly message about rate limiting
    toast.loading('Request queued to prevent rate limiting. Please wait...', { id: 'course-request' });

    const result = editingCourse
      ? await updateCourse(editingCourse._id, formData)
      : await createCourse(formData);

    toast.dismiss('course-request');

    if (result.success) {
      handleCloseModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
    }
  };

  const filteredCourses = Array.isArray(courses) ? courses.filter((course) => {
    const matchesLevel = filterLevel === 'all' || course.level === parseInt(filterLevel);
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  }) : [];

  const getLevelBadge = (level) => {
    const badges = {
      1: { label: 'Foundation', color: '#22c55e' },
      2: { label: 'Efficiency', color: '#16a34a' },
      3: { label: 'Transformation', color: '#15803d' },
    };
    return badges[level] || badges[1];
  };

  return (
    <div className="admin-manager">
      {/* Header */}
      <div className="manager-header">
        <div className="manager-title">
          <h2>Course Management</h2>
          <p>Create and manage sustainability courses</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <span className="material-symbols-outlined">add</span>
          Create Course
        </button>
      </div>

      {/* Filters */}
      <div className="manager-filters">
        <div className="filter-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
          <option value="all">All Levels</option>
          <option value="1">Foundation</option>
          <option value="2">Efficiency</option>
          <option value="3">Transformation</option>
        </select>
      </div>

      {/* Courses List */}
      {coursesLoading ? (
        <div className="manager-loading">
          <LoadingSpinner />
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="manager-grid">
          {filteredCourses.map((course) => {
            const badge = getLevelBadge(course.level);
            return (
              <div key={course._id} className="manager-card">
                <div className="card-header">
                  <h3>{course.title}</h3>
                  <span className="level-badge" style={{ backgroundColor: badge.color }}>
                    {badge.label}
                  </span>
                </div>
                <p className="card-description">{course.description}</p>
                <div className="card-meta">
                  <span>
                    <span className="material-symbols-outlined">schedule</span>
                    {course.duration} mins
                  </span>
                  <span>
                    <span className="material-symbols-outlined">sort</span>
                    Order: {course.orderInLevel}
                  </span>
                </div>
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => handleOpenModal(course)}>
                    <span className="material-symbols-outlined">edit</span>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(course._id)}>
                    <span className="material-symbols-outlined">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="manager-empty">
          <span className="material-symbols-outlined">school</span>
          <h3>No Courses Found</h3>
          <p>Create your first course to get started</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCourse ? 'Edit Course' : 'Create Course'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    required
                  >
                    <option value={1}>Foundation</option>
                    <option value={2}>Efficiency</option>
                    <option value={3}>Transformation</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows="6"
                    placeholder="Course content in markdown or HTML..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Duration (minutes) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Order in Level *</label>
                  <input
                    type="number"
                    value={formData.orderInLevel}
                    onChange={(e) => setFormData({ ...formData, orderInLevel: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={coursesLoading}>
                  {coursesLoading ? <LoadingSpinner size="small" /> : editingCourse ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
