import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';
import api from '../services/Api';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchCourse();
    if (isAuthenticated) {
      checkEnrollment();
    }
  }, [id, isAuthenticated]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
      const lessonList = response.data.lessons || [];
      setLessons(lessonList);
      if (lessonList.length > 0) {
        setSelectedLesson(lessonList[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Course not found');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await api.get('/enroll/my-enrollments');
      const enrolled = response.data.some(e => e.course?._id === id);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    setError('');
    setMessage('');

    try {
      await api.post('/enroll', { courseId: id });
      setMessage('✅ Successfully enrolled in the course!');
      setIsEnrolled(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading course details...</p>
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error || 'Course not found'}</Alert>
        <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Button variant="outline-secondary" onClick={() => navigate('/courses')} className="mb-4">
        ← Back to Courses
      </Button>

      <Row>
        <Col lg={8}>
          <h2>{course.title}</h2>
          <p className="text-muted">👨‍🏫 Instructor: {course.instructor?.name || 'Unknown'}</p>
          <p className="mt-3">{course.description}</p>

          {/* ===== LESSONS SECTION ===== */}
          <h4 className="mt-4">📚 Lessons ({lessons.length})</h4>
          <ListGroup className="mt-2">
            {lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <ListGroup.Item 
                  key={lesson._id || index}
                  action
                  active={selectedLesson?._id === lesson._id}
                  onClick={() => setSelectedLesson(lesson)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{index + 1}. {lesson.title}</strong>
                      {lesson.videoUrl && <Badge bg="danger" className="ms-2">▶️ Video</Badge>}
                    </div>
                    {isEnrolled && <Badge bg="success">✅ Available</Badge>}
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No lessons available yet.</ListGroup.Item>
            )}
          </ListGroup>

          {/* ===== SELECTED LESSON CONTENT ===== */}
          {selectedLesson && isEnrolled && (
            <div className="mt-4 p-4" style={{ 
              background: 'white', 
              borderRadius: '12px', 
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <h4>📖 {selectedLesson.title}</h4>
              
              {/* ✅ VIDEO PLAYER - THIS IS WHAT YOU NEED */}
              {selectedLesson.videoUrl && (
                <div style={{ 
                  margin: '16px 0', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0
                }}>
                  <iframe
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                    src={selectedLesson.videoUrl}
                    title={selectedLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Lesson Content */}
              <div className="mt-3" style={{ lineHeight: '1.8', color: '#4a5568' }}>
                {selectedLesson.content || 'No content available for this lesson.'}
              </div>
            </div>
          )}

          {selectedLesson && !isEnrolled && (
            <div className="mt-4 p-4" style={{ 
              background: '#F1F5F9', 
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p>🔒 Enroll in this course to access lessons and videos.</p>
            </div>
          )}
        </Col>

        {/* ===== RIGHT SIDEBAR ===== */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Img 
              variant="top" 
              src={course.thumbnail || 'https://via.placeholder.com/400x200/667eea/ffffff?text=Course'} 
              alt={course.title}
            />
            <Card.Body>
              <h4 className="text-success">${course.price || 0}</h4>
              <p className="text-muted small">Category: {course.category || 'General'}</p>
              <p className="text-muted small">
                👨‍🎓 {course.enrolledStudents?.length || 0} students enrolled
              </p>
              
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              {isEnrolled ? (
                <Button variant="success" className="w-100" disabled>
                  ✅ Enrolled
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  className="w-100" 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  size="lg"
                >
                  {enrolling ? 'Enrolling...' : '🎓 Enroll Now'}
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetails;