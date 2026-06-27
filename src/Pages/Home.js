import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';
import api from '../services/Api';
import CourseCard from '../Components/CourseCard';
import categories from '../Data/Categories';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory);

  const categoryCounts = {};
  courses.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  return (
    <div style={{ background: '#F1F5F9', minHeight: '100vh' }}>
      {/* ============ HERO ============ */}
      <section className="hero">
        <Container fluid style={{ maxWidth: '1400px' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Learn <span className="highlight">Anything</span>,<br />
              <span className="highlight">Anywhere</span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Join 10,000+ students learning new skills online
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="d-flex gap-3 justify-content-center flex-wrap"
            >
              <Button as={Link} to="/courses" variant="light">
                Explore Courses
              </Button>
              {!isAuthenticated ? (
                <Button as={Link} to="/register" variant="outline-light">
                  Get Started Free
                </Button>
              ) : (
                <Button as={Link} to="/dashboard" variant="outline-light">
                  Dashboard
                </Button>
              )}
            </motion.div>

            <motion.div 
              className="hero-stats"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="hero-stat">
                <span className="number">10K+</span>
                <span className="label">Students</span>
              </div>
              <div className="hero-stat">
                <span className="number">50+</span>
                <span className="label">Courses</span>
              </div>
              <div className="hero-stat">
                <span className="number">20+</span>
                <span className="label">Instructors</span>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ============ CATEGORIES ============ */}
      <Container fluid style={{ maxWidth: '1400px', padding: '0 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <h2 className="section-title">📚 Browse by Category</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Find the perfect course for your learning journey
              </p>
            </div>
            <span style={{ 
              color: '#94A3B8', 
              fontSize: 'var(--font-tiny)',
              background: 'white',
              padding: '0.4rem 1.2rem',
              borderRadius: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              {courses.length} total courses
            </span>
          </div>

          <Row className="g-2 g-md-3">
            <Col xs={4} sm={3} md={2} lg={1.5} key="all">
              <motion.div
                className={`category-card ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
                whileHover={{ y: -3 }}
              >
                <span className="cat-icon">📚</span>
                <div className="cat-name">All</div>
                <div className="cat-count">{courses.length}</div>
              </motion.div>
            </Col>
            {categories.map(cat => (
              <Col xs={4} sm={3} md={2} lg={1.5} key={cat.id}>
                <motion.div
                  className={`category-card ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.name)}
                  whileHover={{ y: -3 }}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-count">{categoryCounts[cat.name] || 0}</div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* ============ COURSES ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                {selectedCategory === 'all' ? 'All Courses' : `${selectedCategory} Courses`}
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 0, fontSize: 'var(--font-tiny)' }}>
                {filteredCourses.length} courses available
              </p>
            </div>
            {selectedCategory !== 'all' && (
              <Button 
                variant="outline-primary" 
                onClick={() => setSelectedCategory('all')}
                size="sm"
                className="rounded-pill"
              >
                View All
              </Button>
            )}
          </div>

          {loading ? (
            <Row className="g-3 g-md-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3} xl={2.4}>
                  <div className="course-card" style={{ height: '280px', background: '#f0f2f5' }}>
                    <div style={{ height: '160px', background: '#e2e8f0', borderRadius: '16px 16px 0 0' }} />
                    <div className="body">
                      <div style={{ height: '16px', width: '80%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '6px' }} />
                      <div style={{ height: '12px', width: '60%', background: '#e2e8f0', borderRadius: '4px' }} />
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-5" style={{ background: 'white', borderRadius: '16px', padding: '3rem' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📚</span>
              <h3>No courses in this category yet</h3>
              <p className="text-muted">Check back later for new courses!</p>
            </div>
          ) : (
            <Row className="g-3 g-md-4">
              {filteredCourses.map(course => (
                <Col key={course._id} xs={12} sm={6} md={4} lg={3} xl={2.4}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -4 }}
                    style={{ height: '100%' }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default Home;