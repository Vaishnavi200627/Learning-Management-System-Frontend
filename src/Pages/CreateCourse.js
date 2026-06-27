import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';
import api from '../services/Api';

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    thumbnail: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'Web Development',
    'Data Science',
    'AI & Machine Learning',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity',
    'Mobile Development',
    'Game Development'
  ];

  // Only instructors can create courses
  if (!user || user.role !== 'instructor') {
    return (
      <Container className="my-5 text-center">
        <Card className="p-5 shadow-lg" style={{ maxWidth: '500px', margin: '0 auto', borderRadius: '24px' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🔒</div>
          <h3 style={{ fontWeight: 700 }}>Access Denied</h3>
          <p className="text-muted">Only instructors can create courses.</p>
          <Button as={Link} to="/" variant="primary" className="rounded-pill px-4 py-2">
            Go Home
          </Button>
        </Card>
      </Container>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/courses', {
        ...formData,
        price: parseFloat(formData.price) || 0
      });
      setSuccess('✅ Course created successfully!');
      setTimeout(() => navigate(`/manage-course/${response.data._id}`), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ 
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FDF2F8 100%)',
      minHeight: '100vh',
      padding: '40px 0'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={7} md={9}>
            {/* Header */}
            <div className="text-center mb-4">
              <div style={{ fontSize: '56px', marginBottom: '8px' }}>📚</div>
              <h1 style={{ 
                fontSize: '36px', 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>
                Create New Course
              </h1>
              <p className="text-muted" style={{ fontSize: '18px' }}>
                Share your knowledge with the world
              </p>
            </div>

            {/* Main Card */}
            <Card style={{ 
              borderRadius: '24px', 
              border: 'none',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              {/* Card Header Gradient */}
              <div style={{
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                padding: '20px 32px',
                color: 'white'
              }}>
                <div className="d-flex align-items-center gap-3">
                  <span style={{ fontSize: '28px' }}>✏️</span>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>Course Details</h4>
                    <small style={{ opacity: 0.8 }}>Fill in the information below</small>
                  </div>
                </div>
              </div>

              <Card.Body style={{ padding: '36px 32px' }}>
                {error && <Alert variant="danger" className="rounded-pill">{error}</Alert>}
                {success && <Alert variant="success" className="rounded-pill">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {/* Course Title */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
                      <span style={{ fontSize: '20px' }}>📖</span> Course Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Web Development Bootcamp"
                      required
                      style={{
                        padding: '14px 18px',
                        borderRadius: '12px',
                        border: '2px solid #E2E8F0',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                      onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    />
                  </Form.Group>

                  {/* Description */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
                      <span style={{ fontSize: '20px' }}>📝</span> Description <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="5"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe what students will learn, prerequisites, and outcomes..."
                      required
                      style={{
                        padding: '14px 18px',
                        borderRadius: '12px',
                        border: '2px solid #E2E8F0',
                        fontSize: '16px',
                        resize: 'vertical',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                      onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    />
                  </Form.Group>

                  {/* Category */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
                      <span style={{ fontSize: '20px' }}>🏷️</span> Category <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                      style={{
                        padding: '14px 18px',
                        borderRadius: '12px',
                        border: '2px solid #E2E8F0',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                      onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      {/* Price */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
                          <span style={{ fontSize: '20px' }}>💰</span> Price ($)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          style={{
                            padding: '14px 18px',
                            borderRadius: '12px',
                            border: '2px solid #E2E8F0',
                            fontSize: '16px',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                          onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      {/* Thumbnail */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
                          <span style={{ fontSize: '20px' }}>🖼️</span> Thumbnail URL
                        </Form.Label>
                        <Form.Control
                          type="url"
                          value={formData.thumbnail}
                          onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                          placeholder="https://images.unsplash.com/..."
                          style={{
                            padding: '14px 18px',
                            borderRadius: '12px',
                            border: '2px solid #E2E8F0',
                            fontSize: '16px',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                          onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    className="w-100 fw-bold rounded-pill py-3 mt-2"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                      border: 'none',
                      fontSize: '18px',
                      boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      '🚀 Create Course'
                    )}
                  </Button>
                </Form>

                {/* Back Link */}
                <div className="text-center mt-4">
                  <Link to="/courses" className="text-decoration-none" style={{ color: '#64748B' }}>
                    ← Back to Courses
                  </Link>
                </div>
              </Card.Body>
            </Card>

            {/* Tips Card */}
            <Card className="mt-4" style={{ 
              borderRadius: '16px',
              border: 'none',
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}>
              <Card.Body className="d-flex align-items-center gap-3" style={{ padding: '16px 24px' }}>
                <span style={{ fontSize: '28px' }}>💡</span>
                <div>
                  <small className="fw-bold d-block">Pro Tip</small>
                  <small className="text-muted">Use high-quality images and detailed descriptions to attract more students!</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CreateCourse;