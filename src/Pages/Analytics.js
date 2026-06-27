import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';
import DashboardLayout from '../Components/DashboardLayout';
import api from '../services/Api';
import { 
  FaChartLine, 
  FaUsers, 
  FaBook, 
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaClock
} from 'react-icons/fa';

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    completionRate: 0,
    popularCourses: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch courses to calculate analytics
      const response = await api.get('/courses');
      const courses = response.data;
      
      // Calculate total students
      const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);
      
      // Calculate total revenue
      const totalRevenue = courses.reduce((acc, c) => acc + ((c.enrolledStudents?.length || 0) * (c.price || 0)), 0);
      
      // Calculate average completion rate (simulated)
      const completionRate = Math.round(45 + Math.random() * 30);
      
      // Get popular courses (sorted by enrollment)
      const popularCourses = [...courses]
        .sort((a, b) => (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0))
        .slice(0, 5);
      
      setStats({
        totalStudents,
        totalCourses: courses.length,
        totalRevenue,
        completionRate,
        popularCourses,
        recentActivity: [
          { action: 'New student enrolled', time: '2 minutes ago', icon: '👤' },
          { action: 'Course created: Web Dev', time: '15 minutes ago', icon: '📚' },
          { action: 'Student completed course', time: '1 hour ago', icon: '✅' },
          { action: 'New course added: AI', time: '3 hours ago', icon: '📖' },
        ]
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      icon: <FaUsers size={24} />, 
      label: 'Total Students', 
      value: stats.totalStudents.toLocaleString(), 
      change: '+12%',
      up: true,
      color: '#4F46E5',
      bg: '#EEF2FF'
    },
    { 
      icon: <FaBook size={24} />, 
      label: 'Total Courses', 
      value: stats.totalCourses, 
      change: '+5%',
      up: true,
      color: '#10B981',
      bg: '#ECFDF5'
    },
    { 
      icon: <FaDollarSign size={24} />, 
      label: 'Total Revenue', 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      change: '+18%',
      up: true,
      color: '#F59E0B',
      bg: '#FEF3C7'
    },
    { 
      icon: <FaStar size={24} />, 
      label: 'Completion Rate', 
      value: `${stats.completionRate}%`, 
      change: '-2%',
      up: false,
      color: '#EF4444',
      bg: '#FEF2F2'
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-5">
          <div style={{ fontSize: '24px' }}>⏳ Loading analytics...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 700, 
              marginBottom: '4px',
              color: '#1E293B'
            }}>
              📊 Analytics Dashboard
            </h2>
            <p style={{ color: '#94A3B8', margin: 0 }}>
              Track your platform's performance and growth
            </p>
          </div>
          <span style={{ 
            fontSize: '14px', 
            color: '#94A3B8',
            background: '#F1F5F9',
            padding: '8px 16px',
            borderRadius: '30px'
          }}>
            Last 30 days
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        {statCards.map((stat, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <Card style={{
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              padding: '20px',
              height: '100%',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color
                }}>
                  {stat.icon}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: stat.up ? '#10B981' : '#EF4444',
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  {stat.up ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                  {stat.change}
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#1E293B' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '14px', color: '#94A3B8' }}>
                  {stat.label}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Popular Courses */}
      <Row className="g-4">
        <Col lg={8}>
          <Card style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            padding: '24px'
          }}>
            <h5 style={{ fontWeight: 700, marginBottom: '16px' }}>
              🔥 Popular Courses
            </h5>
            {stats.popularCourses.length === 0 ? (
              <p style={{ color: '#94A3B8' }}>No courses yet.</p>
            ) : (
              stats.popularCourses.map((course, index) => (
                <div
                  key={course._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: index < stats.popularCourses.length - 1 ? '1px solid #F1F5F9' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#4F46E5',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700
                    }}>
                      {index + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{course.title}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                        {course.enrolledStudents?.length || 0} students
                      </div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600, color: '#4F46E5' }}>
                    ${course.price || 0}
                  </span>
                </div>
              ))
            )}
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col lg={4}>
          <Card style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            padding: '24px'
          }}>
            <h5 style={{ fontWeight: 700, marginBottom: '16px' }}>
              🕐 Recent Activity
            </h5>
            {stats.recentActivity.map((activity, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: index < stats.recentActivity.length - 1 ? '1px solid #F1F5F9' : 'none'
                }}
              >
                <span style={{ fontSize: '24px' }}>{activity.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{activity.action}</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default Analytics;