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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 25px rgba(79, 70, 229, 0.4)",
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div style={{ background: '#F1F5F9', minHeight: '100vh' }}>
      {/* ============ HERO - ANIMATED ============ */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ padding: '80px 0 60px', textAlign: 'center' }}
      >
        <Container fluid style={{ maxWidth: '1440px' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              variants={itemVariants}
              style={{ 
                fontSize: '64px', 
                fontWeight: 800, 
                marginBottom: '12px',
                letterSpacing: '-2px',
                color: 'white'
              }}
            >
              Learn <motion.span
                style={{ 
                  background: 'linear-gradient(135deg, #FCD34D, #FBBF24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block'
                }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                Anything
              </motion.span>
              ,<br />
              <motion.span
                style={{ 
                  background: 'linear-gradient(135deg, #FCD34D, #FBBF24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block'
                }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  transition: { duration: 3, delay: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                Anywhere
              </motion.span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              style={{ 
                fontSize: '22px', 
                marginBottom: '28px', 
                opacity: 0.9, 
                color: 'white',
                maxWidth: '700px',
                margin: '0 auto 28px'
              }}
            >
              Join 10,000+ students learning new skills online
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="d-flex gap-3 justify-content-center flex-wrap"
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button as={Link} to="/courses" variant="light" className="px-5 py-3 fw-bold rounded-pill" style={{ fontSize: '18px' }}>
                  Explore Courses
                </Button>
              </motion.div>
              {!isAuthenticated ? (
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button as={Link} to="/register" variant="outline-light" className="px-5 py-3 fw-bold rounded-pill" style={{ fontSize: '18px' }}>
                    Get Started Free
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button as={Link} to="/dashboard" variant="outline-light" className="px-5 py-3 fw-bold rounded-pill" style={{ fontSize: '18px' }}>
                    Dashboard
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Animated Stats */}
            <motion.div 
              className="hero-stats"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ 
                display: 'flex',
                justifyContent: 'center',
                gap: '80px',
                marginTop: '40px',
                flexWrap: 'wrap'
              }}
            >
              {[
                { number: '10K+', label: 'Students' },
                { number: '50+', label: 'Courses' },
                { number: '20+', label: 'Instructors' }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="hero-stat"
                  variants={statVariants}
                  whileHover={{ 
                    y: -8,
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  style={{ cursor: 'default' }}
                >
                  <motion.span 
                    className="number" 
                    style={{ 
                      fontSize: '36px', 
                      fontWeight: 800, 
                      color: 'white',
                      display: 'block'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + (index * 0.2), duration: 0.8 }}
                  >
                    {stat.number}
                  </motion.span>
                  <span className="label" style={{ fontSize: '15px', opacity: 0.8, color: 'white' }}>
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </Container>
      </motion.section>

      {/* ============ CATEGORIES - ANIMATED ============ */}
      <Container fluid style={{ maxWidth: '1440px', padding: '0 32px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ marginTop: '32px', marginBottom: '32px' }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: 0, color: '#1E293B' }}>
                📚 Browse by Category
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '16px', marginBottom: 0 }}>
                Find the perfect course for your learning journey
              </p>
            </div>
            <span style={{ 
              color: '#94A3B8', 
              fontSize: '15px',
              background: 'white',
              padding: '8px 20px',
              borderRadius: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              {courses.length} total courses
            </span>
          </motion.div>

          <motion.div
            className="row g-3"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div className="col-6 col-sm-4 col-md-3 col-lg-2" variants={itemVariants}>
              <motion.div
                className={`category-card ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  padding: '20px 16px !important', 
                  borderRadius: '14px !important',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: selectedCategory === 'all' ? '#EEF2FF' : 'white',
                  border: selectedCategory === 'all' ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease'
                }}
              >
                <motion.span 
                  style={{ fontSize: '32px', display: 'block', marginBottom: '4px' }}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  📚
                </motion.span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>All</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#4F46E5' }}>
                  {courses.length}
                </div>
              </motion.div>
            </motion.div>
            {categories.map(cat => (
              <motion.div key={cat.id} className="col-6 col-sm-4 col-md-3 col-lg-2" variants={itemVariants}>
                <motion.div
                  className={`category-card ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.name)}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    padding: '20px 16px !important', 
                    borderRadius: '14px !important',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: selectedCategory === cat.name ? '#EEF2FF' : 'white',
                    border: selectedCategory === cat.name ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <motion.span 
                    style={{ fontSize: '32px', display: 'block', marginBottom: '4px' }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {cat.icon}
                  </motion.span>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', lineHeight: 1.2, marginBottom: '2px' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#4F46E5' }}>
                    {categoryCounts[cat.name] || 0}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ============ COURSES - ANIMATED ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px',
              marginTop: '8px'
            }}
          >
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: 0, color: '#1E293B' }}>
                {selectedCategory === 'all' ? 'All Courses' : `${selectedCategory} Courses`}
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '15px', marginBottom: 0 }}>
                {filteredCourses.length} courses available
              </p>
            </div>
            {selectedCategory !== 'all' && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline-primary" 
                  onClick={() => setSelectedCategory('all')}
                  className="rounded-pill"
                  size="sm"
                >
                  View All
                </Button>
              </motion.div>
            )}
          </motion.div>

          {loading ? (
            <Row className="g-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3} xl={2.4}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <div className="course-card" style={{ height: '320px', background: '#f0f2f5' }}>
                      <div style={{ height: '180px', background: '#e2e8f0', borderRadius: '16px 16px 0 0' }} />
                      <div className="body">
                        <div style={{ height: '16px', width: '80%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '6px' }} />
                        <div style={{ height: '12px', width: '60%', background: '#e2e8f0', borderRadius: '4px' }} />
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          ) : filteredCourses.length === 0 ? (
            <motion.div 
              className="text-center py-5" 
              style={{ background: 'white', borderRadius: '16px', padding: '60px' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <span style={{ fontSize: '56px', display: 'block', marginBottom: '16px' }}>📚</span>
              <h3>No courses in this category yet</h3>
              <p className="text-muted">Check back later for new courses!</p>
              {selectedCategory !== 'all' && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="primary" 
                    onClick={() => setSelectedCategory('all')}
                    className="rounded-pill px-4 mt-3"
                  >
                    View All Courses
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="row g-4"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {filteredCourses.map(course => (
                <motion.div 
                  key={course._id} 
                  className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2-4"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%' }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default Home;