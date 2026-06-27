import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';
import DashboardLayout from '../Components/DashboardLayout';
import api from '../services/Api';
import { FaUser, FaEnvelope, FaUserTag, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Update user profile (you need to add this endpoint in backend)
      const response = await api.put('/auth/profile', {
        name: formData.name
      });
      setProfile(response.data);
      setSuccess('✅ Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-5">
          <div style={{ fontSize: '24px' }}>⏳ Loading profile...</div>
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
              👤 My Profile
            </h2>
            <p style={{ color: '#94A3B8', margin: 0 }}>
              Manage your account information
            </p>
          </div>
          {!editing && (
            <Button 
              variant="primary" 
              onClick={() => setEditing(true)}
              className="rounded-pill px-4"
            >
              <FaEdit className="me-2" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Row className="g-4">
        {/* Profile Card */}
        <Col lg={4}>
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            textAlign: 'center',
            padding: '32px 24px'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: 'white',
              margin: '0 auto 16px',
              boxShadow: '0 8px 32px rgba(79, 70, 229, 0.3)'
            }}>
              {profile?.name?.charAt(0) || 'U'}
            </div>
            <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>{profile?.name}</h4>
            <p style={{ color: '#94A3B8', marginBottom: '4px' }}>{profile?.email}</p>
            <span style={{
              display: 'inline-block',
              padding: '4px 16px',
              borderRadius: '20px',
              background: profile?.role === 'instructor' ? '#EEF2FF' : '#ECFDF5',
              color: profile?.role === 'instructor' ? '#4F46E5' : '#10B981',
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'capitalize'
            }}>
              {profile?.role || 'Student'}
            </span>
          </Card>
        </Col>

        {/* Edit Form */}
        <Col lg={8}>
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            padding: '32px'
          }}>
            <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>
              {editing ? '✏️ Edit Profile' : '📋 Profile Information'}
            </h5>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <FaUser className="me-2" /> Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={!editing}
                  size="lg"
                  style={{
                    borderRadius: '12px',
                    background: editing ? 'white' : '#F8FAFC'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <FaEnvelope className="me-2" /> Email
                </Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  disabled
                  size="lg"
                  style={{
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    cursor: 'not-allowed'
                  }}
                />
                <Form.Text className="text-muted">
                  Email cannot be changed
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <FaUserTag className="me-2" /> Role
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formData.role}
                  disabled
                  size="lg"
                  style={{
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    cursor: 'not-allowed',
                    textTransform: 'capitalize'
                  }}
                />
                <Form.Text className="text-muted">
                  Role cannot be changed
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  📅 Member Since
                </Form.Label>
                <Form.Control
                  type="text"
                  value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  disabled
                  size="lg"
                  style={{
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    cursor: 'not-allowed'
                  }}
                />
              </Form.Group>

              {editing && (
                <div className="d-flex gap-3 mt-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="rounded-pill px-4"
                    disabled={saving}
                  >
                    <FaSave className="me-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    className="rounded-pill px-4"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: profile.name,
                        email: profile.email,
                        role: profile.role
                      });
                      setError('');
                      setSuccess('');
                    }}
                  >
                    <FaTimes className="me-2" /> Cancel
                  </Button>
                </div>
              )}
            </Form>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default Profile;