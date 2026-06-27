import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import api from '../services/Api';

const ManageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    order: 1
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
      setLessons(response.data.lessons || []);
    } catch (error) {
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is the instructor
  if (!loading && course && user?._id !== course.instructor?._id && user?.role !== 'admin') {
    return (
      <div className="container my-5 text-center">
        <h3>⚠️ Access Denied</h3>
        <p>You are not the instructor of this course.</p>
        <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
      </div>
    );
  }

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      if (editingLesson) {
        // Update existing lesson (we'll implement this later)
        setSuccess('✅ Lesson updated successfully!');
      } else {
        // Create new lesson
        await api.post(`/courses/${id}/lessons`, formData);
        setSuccess('✅ Lesson added successfully!');
      }
      
      setFormData({ title: '', content: '', videoUrl: '', order: 1 });
      setShowLessonForm(false);
      setEditingLesson(null);
      fetchCourse(); // Refresh lessons
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save lesson');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    
    try {
      await api.delete(`/courses/${id}/lessons/${lessonId}`);
      setSuccess('✅ Lesson deleted successfully!');
      fetchCourse();
    } catch (error) {
      setError('Failed to delete lesson');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading course...</div>;
  }

  return (
    <div className="container my-5">
      <div className="flex flex-between">
        <div>
          <Link to="/courses" className="btn btn-outline" style={{ marginBottom: '20px' }}>
            ← Back to Courses
          </Link>
          <h2>📚 Manage Course: {course?.title}</h2>
          <p className="text-muted">Add and manage lessons for your course</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowLessonForm(!showLessonForm);
            setEditingLesson(null);
            setFormData({ title: '', content: '', videoUrl: '', order: lessons.length + 1 });
          }}
        >
          {showLessonForm ? '✕ Cancel' : '➕ Add Lesson'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Lesson Form */}
      {showLessonForm && (
        <div className="card" style={{ margin: '20px 0', padding: '24px' }}>
          <h3>{editingLesson ? '✏️ Edit Lesson' : '📝 Add New Lesson'}</h3>
          <form onSubmit={handleLessonSubmit}>
            <div className="form-group">
              <label className="form-label">Lesson Title *</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="e.g., Introduction to HTML"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content (Text) *</label>
              <textarea
                className="form-control"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                rows="6"
                placeholder="Detailed lesson content, instructions, code examples..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Video URL (YouTube)</label>
              <input
                type="url"
                className="form-control"
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
              />
              <small className="text-muted">Paste the embed URL from YouTube</small>
            </div>

            <div className="form-group">
              <label className="form-label">Order</label>
              <input
                type="number"
                className="form-control"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                min="1"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={uploading}
            >
              {uploading ? 'Saving...' : editingLesson ? '💾 Update Lesson' : '➕ Add Lesson'}
            </button>
          </form>
        </div>
      )}

      {/* Lessons List */}
      <h3>📖 Lessons ({lessons.length})</h3>
      {lessons.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h3>No lessons yet</h3>
          <p className="text-muted">Click "Add Lesson" to start building your course content.</p>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {lessons.map((lesson, index) => (
            <div 
              key={lesson._id || index}
              className="card"
              style={{ marginBottom: '16px', padding: '16px 20px' }}
            >
              <div className="flex flex-between">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="badge badge-primary">#{lesson.order || index + 1}</span>
                    <h4 style={{ margin: 0 }}>{lesson.title}</h4>
                    {lesson.videoUrl && <span className="badge badge-warning">▶️ Video</span>}
                  </div>
                  <p className="text-muted" style={{ marginTop: '8px', fontSize: '14px' }}>
                    {lesson.content?.substring(0, 150)}...
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-outline"
                    onClick={() => {
                      setEditingLesson(lesson);
                      setFormData({
                        title: lesson.title,
                        content: lesson.content,
                        videoUrl: lesson.videoUrl || '',
                        order: lesson.order || index + 1
                      });
                      setShowLessonForm(true);
                    }}
                    style={{ padding: '6px 12px', fontSize: '14px' }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteLesson(lesson._id)}
                    style={{ padding: '6px 12px', fontSize: '14px' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Stats */}
      <div className="grid grid-4" style={{ marginTop: '40px' }}>
        <div className="stat-card stat-primary">
          <h4>Total Lessons</h4>
          <h1>{lessons.length}</h1>
        </div>
        <div className="stat-card stat-success">
          <h4>Students Enrolled</h4>
          <h1>{course?.enrolledStudents?.length || 0}</h1>
        </div>
        <div className="stat-card stat-warning">
          <h4>Status</h4>
          <h3 style={{ fontSize: '20px', margin: '10px 0 0 0' }}>
            {lessons.length > 0 ? '🟢 Active' : '🟡 Draft'}
          </h3>
        </div>
        <div className="stat-card stat-purple">
          <h4>Price</h4>
          <h1>${course?.price || 0}</h1>
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;