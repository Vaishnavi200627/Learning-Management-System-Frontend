import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, role);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-4 p-md-5 shadow-lg" style={{ maxWidth: '500px', width: '100%', borderRadius: '20px' }}>
        <div className="text-center mb-4">
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📚 LearnHub
          </h1>
          <p className="text-muted">Create your account to get started</p>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Full Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              size="lg"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              size="lg"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Role</Form.Label>
            <Form.Select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              size="lg"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              size="lg"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              size="lg"
            />
          </Form.Group>
          
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-100 fw-bold rounded-pill"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </Form>
        
        <div className="text-center mt-3">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="fw-semibold" style={{ color: '#4F46E5', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </Card>
    </Container>
  );
};

export default Register;