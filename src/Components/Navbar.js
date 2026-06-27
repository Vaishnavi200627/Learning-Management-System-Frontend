import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';

const NavbarComponent = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="shadow-sm py-3" style={{ 
      background: 'white',
      borderBottom: '2px solid #f0f2f5'
    }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ 
          fontSize: '36px', 
          fontWeight: 800,
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-1px'
        }}>
          📚 LearnHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-3">
            {/* ✅ Home Link - ALWAYS Visible */}
            <Nav.Link as={Link} to="/" style={{ 
              fontSize: '18px', 
              fontWeight: 600,
              color: '#1E293B',
              padding: '8px 16px'
            }}>
              Home
            </Nav.Link>
            
            {isAuthenticated ? (
              <>
                {/* Courses */}
                <Nav.Link as={Link} to="/courses" style={{ 
                  fontSize: '18px', 
                  fontWeight: 600,
                  color: '#1E293B',
                  padding: '8px 16px'
                }}>
                  Courses
                </Nav.Link>

                {/* Dashboard */}
                <Nav.Link as={Link} to="/dashboard" style={{ 
                  fontSize: '18px', 
                  fontWeight: 600,
                  color: '#1E293B',
                  padding: '8px 16px'
                }}>
                  Dashboard
                </Nav.Link>

                {/* ✅ PROFILE - ADD THIS HERE */}
                <Nav.Link as={Link} to="/profile" style={{ 
                  fontSize: '18px', 
                  fontWeight: 600,
                  color: '#1E293B',
                  padding: '8px 16px'
                }}>
                  👤 Profile
                </Nav.Link>

                {/* ✅ SETTINGS - ADD THIS HERE */}
                <Nav.Link as={Link} to="/settings" style={{ 
                  fontSize: '18px', 
                  fontWeight: 600,
                  color: '#1E293B',
                  padding: '8px 16px'
                }}>
  ⚙️ Settings
</Nav.Link>

                {/* Analytics - Only for Instructors */}
                {user?.role === 'instructor' && (
                  <Nav.Link as={Link} to="/analytics" style={{ 
                    fontSize: '18px', 
                    fontWeight: 600,
                    color: '#1E293B',
                    padding: '8px 16px'
                  }}>
                    📊 Analytics
                  </Nav.Link>
                )}

                {/* Create Course - Only for Instructors */}
                {user?.role === 'instructor' && (
                  <Nav.Link as={Link} to="/create-course" style={{ 
                    fontSize: '18px', 
                    fontWeight: 600,
                    color: 'white',
                    padding: '8px 24px',
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)'
                  }}>
                    ➕ Create
                  </Nav.Link>
                )}

                {/* User Name & Logout */}
                <span style={{ 
                  fontSize: '17px', 
                  fontWeight: 500,
                  color: '#64748B',
                  padding: '8px 16px',
                  background: '#F1F5F9',
                  borderRadius: '30px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  👤 {user?.name}
                </span>
                <Button 
                  onClick={handleLogout}
                  variant="outline-danger"
                  style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    padding: '8px 24px',
                    borderRadius: '30px',
                    borderWidth: '2px'
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/courses" style={{ 
                  fontSize: '18px', 
                  fontWeight: 600,
                  color: '#1E293B',
                  padding: '8px 16px'
                }}>
                  Courses
                </Nav.Link>
                <Nav.Link as={Link} to="/login" style={{ 
                  fontSize: '18px', 
                  fontWeight: 600,
                  color: '#1E293B',
                  padding: '8px 16px'
                }}>
                  Login
                </Nav.Link>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary"
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    padding: '10px 28px',
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    border: 'none'
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;