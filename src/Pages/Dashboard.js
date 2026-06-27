import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';
import DashboardLayout from '../Components/DashboardLayout';
import StudyTracker from '../Components/StudyTracker';
import api from '../services/Api';
import { 
  FaBook, 
  FaCheckCircle, 
  FaClock, 
  FaUserGraduate,
  FaArrowRight
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completed: 0,
    inProgress: 0
  });

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/enroll/my-enrollments');
      setEnrollments(response.data);
      const total = response.data.length;
      const completed = response.data.filter(e => e.progress === 100).length;
      const inProgress = response.data.filter(e => e.progress > 0 && e.progress < 100).length;
      setStats({ totalCourses: total, completed, inProgress });
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      icon: <FaBook size={28} />, 
      label: 'Enrolled', 
      value: stats.totalCourses, 
      color: '#4F46E5', 
      bg: '#EEF2FF',
      gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)'
    },
    { 
      icon: <FaCheckCircle size={28} />, 
      label: 'Completed', 
      value: stats.completed, 
      color: '#10B981', 
      bg: '#ECFDF5',
      gradient: 'linear-gradient(135deg, #10B981, #059669)'
    },
    { 
      icon: <FaClock size={28} />, 
      label: 'In Progress', 
      value: stats.inProgress, 
      color: '#F59E0B', 
      bg: '#FEF3C7',
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)'
    },
    { 
      icon: <FaUserGraduate size={28} />, 
      label: 'Role', 
      value: user?.role || 'Student', 
      color: '#7C3AED', 
      bg: '#F5F3FF',
      gradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)'
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: 700, 
          marginBottom: '4px',
          color: '#1E293B'
        }}>
          📊 Dashboard
        </h2>
        <p style={{ color: '#94A3B8', margin: 0 }}>
          Welcome back, {user?.name}! Here's your learning progress.
        </p>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        {statCards.map((stat, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <Card style={{
              border: 'none',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              padding: '24px 20px',
              height: '100%',
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: stat.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: `0 4px 15px ${stat.color}40`
                }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#94A3B8', fontWeight: 500 }}>
                    {stat.label}
                  </div>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: 800, 
                    color: stat.color,
                    lineHeight: 1.2
                  }}>
                    {stat.value}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Study Tracker */}
      <StudyTracker />

      {/* My Courses Section */}
      <div style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid rgba(255,255,255,0.3)',
        marginTop: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
              📚 My Courses
            </h3>
            <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
              Continue your learning journey
            </p>
          </div>
          <Link to="/courses" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#4F46E5',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px'
          }}>
            View All <FaArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '32px' }}>⏳</div>
            <p>Loading your courses...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'rgba(0,0,0,0.02)',
            borderRadius: '16px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
            <h3 style={{ fontWeight: 600 }}>No courses enrolled yet</h3>
            <p style={{ color: '#94A3B8', marginBottom: '20px' }}>
              Browse courses and start your learning journey!
            </p>
            <Link to="/courses" className="btn btn-primary rounded-pill px-5 py-2">
              Browse Courses
            </Link>
          </div>
        ) : (
          <Row className="g-4">
            {enrollments.map((enrollment) => (
              <Col key={enrollment._id} xs={12} md={6} lg={4}>
                <Card style={{
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  height: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Card.Body>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      marginBottom: '12px',
                      color: 'white'
                    }}>
                      📘
                    </div>
                    <h5 style={{ fontWeight: 600, marginBottom: '8px' }}>
                      {enrollment.course?.title || 'Course'}
                    </h5>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      margin: '12px 0 8px',
                      fontSize: '14px'
                    }}>
                      <span className={`badge ${enrollment.progress === 100 ? 'badge-success' : 'badge-primary'}`}>
                        {enrollment.progress === 100 ? '✅ Completed' : '📖 In Progress'}
                      </span>
                      <span style={{ fontWeight: 600 }}>{enrollment.progress}%</span>
                    </div>
                    <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${enrollment.progress}%`,
                          background: enrollment.progress === 100 
                            ? 'linear-gradient(90deg, #10B981, #059669)' 
                            : 'linear-gradient(90deg, #4F46E5, #7C3AED)'
                        }} 
                      />
                    </div>
                    <Link 
                      to={`/courses/${enrollment.course?._id}`} 
                      className="btn btn-outline-primary w-100 mt-3 rounded-pill"
                      style={{ fontSize: '14px' }}
                    >
                      Continue Learning →
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;