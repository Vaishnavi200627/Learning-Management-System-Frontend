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

  // ============ ANIMATION VARIANTS ============
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // ============ PULSE ANIMATION ============
  const pulseVariants = {
    pulse: {
      scale: [1, 1.08, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // ============ FLOATING STATS ============
  const floatVariants = {
    float: (i) => ({
      y: [0, -12, 0],
      transition: {
        duration: 2.5,
        delay: i * 0.3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  };

  // ============ GLOW BUTTON ============
  const glowVariants = {
    glow: {
      boxShadow: [
        "0 0 15px rgba(79, 70, 229, 0.3)",
        "0 0 35px rgba(79, 70, 229, 0.6)",
        "0 0 15px rgba(79, 70, 229, 0.3)"
      ],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div style={{ background: '#F1F5F9', minHeight: '100vh' }}>
      {/* ============ HERO SECTION ============ */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ padding: '80px 0 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
      >
        {/* Animated Background Particles */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <Container fluid style={{ maxWidth: '1440px', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* ===== HERO TITLE WITH PULSE ===== */}
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
              Learn{" "}
              <motion.span
                style={{ 
                  background: 'linear-gradient(135deg, #FCD34D, #FBBF24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block'
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
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
                  scale: [1, 1.15, 1],
                  rotate: [2, -2, 2],
                }}
                transition={{
                  duration: 3,
                  delay: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Anywhere
              </motion.span>
            </motion.h1>

            {/* ===== HERO SUBTITLE ===== */}
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

            {/* ===== HERO BUTTONS WITH GLOW ===== */}
            <motion.div
              variants={itemVariants}
              className="d-flex gap-3 justify-content-center flex-wrap"
            >
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                variants={glowVariants}
                animate="glow"
              >
                <Button as={Link} to="/courses" variant="light" className="px-5 py-3 fw-bold rounded-pill" style={{ fontSize: '18px' }}>
                  Explore Courses
                </Button>
              </motion.div>
              {!isAuthenticated ? (
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Button as={Link} to="/register" variant="outline-light" className="px-5 py-3 fw-bold rounded-pill" style={{ fontSize: '18px' }}>
                    Get Started Free
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Button as={Link} to="/dashboard" variant="outline-light" className="px-5 py-3 fw-bold rounded-pill" style={{ fontSize: '18px' }}>
                    Dashboard
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* ===== HERO STATS WITH FLOATING ===== */}
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
                  custom={index}
                  variants={floatVariants}
                  animate="float"
                  whileHover={{ 
                    scale: 1.15,
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
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + (index * 0.2), duration: 0.8, type: "spring" }}
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

      {/* ============ CATEGORIES ============ */}
      <Container fluid style={{ maxWidth: '1440px', padding: '0 32px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 80 }}
          style={{ marginTop: '32px', marginBottom: '32px' }}
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
            <motion.span 
              style={{ 
                color: '#94A3B8', 
                fontSize: '15px',
                background: 'white',
                padding: '8px 20px',
                borderRadius: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {courses.length} total courses
            </motion.span>
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
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  boxShadow: "0 12px 30px rgba(79, 70, 229, 0.2)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
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
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
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
                  whileHover={{ 
                    y: -10, 
                    scale: 1.05,
                    boxShadow: "0 12px 30px rgba(79, 70, 229, 0.2)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
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
                    whileHover={{ 
                      scale: 1.3,
                      rotate: 15,
                      transition: { duration: 0.2 }
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {cat.icon}
                  </motion.span>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', lineHeight: 1.2, marginBottom: '2px' }}>
                    {cat.name}
                  </div>
                  <motion.div 
                    style={{ fontSize: '20px', fontWeight: 700, color: '#4F46E5' }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {categoryCounts[cat.name] || 0}
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ============ COURSES ============ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 80 }}
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
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
              transition={{ duration: 0.5, type: "spring" }}
            >
              <motion.span 
                style={{ fontSize: '56px', display: 'block', marginBottom: '16px' }}
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                📚
              </motion.span>
              <h3>No courses in this category yet</h3>
              <p className="text-muted">Check back later for new courses!</p>
              {selectedCategory !== 'all' && (
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
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
                    whileHover={{ 
                      y: -10,
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
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