import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Switch } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';
import DashboardLayout from '../Components/DashboardLayout';
import api from '../services/Api';
import { 
  FaBell, 
  FaMoon, 
  FaGlobe, 
  FaLock, 
  FaUser, 
  FaSave, 
  FaUndo,
  FaEnvelope,
  FaShieldAlt,
  FaLanguage,
  FaPalette,
  FaFont
} from 'react-icons/fa';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    marketingEmails: false,
    
    // Appearance
    darkMode: false,
    fontSize: 'medium',
    language: 'english',
    
    // Privacy
    profileVisibility: 'public',
    showProgress: true,
    showEnrolledCourses: true,
    
    // Display
    compactView: false,
    showThumbnails: true,
    autoPlay: false
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsed });
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // If you have a backend API for settings, save there too
      // await api.put('/auth/settings', settings);
      
      setSuccess('✅ Settings saved successfully!');
      
      // Apply dark mode immediately
      if (settings.darkMode) {
        document.body.style.background = '#0F172A';
        document.body.style.color = '#F1F5F9';
      } else {
        document.body.style.background = '';
        document.body.style.color = '';
      }
      
    } catch (error) {
      setError('Failed to save settings');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      emailNotifications: true,
      pushNotifications: true,
      courseUpdates: true,
      marketingEmails: false,
      darkMode: false,
      fontSize: 'medium',
      language: 'english',
      profileVisibility: 'public',
      showProgress: true,
      showEnrolledCourses: true,
      compactView: false,
      showThumbnails: true,
      autoPlay: false
    });
    localStorage.removeItem('userSettings');
    setSuccess('🔄 Settings reset to default');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-5">
          <div style={{ fontSize: '24px' }}>⏳ Loading settings...</div>
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
              ⚙️ Settings
            </h2>
            <p style={{ color: '#94A3B8', margin: 0 }}>
              Customize your learning experience
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={resetSettings}
              className="rounded-pill px-4"
            >
              <FaUndo className="me-2" /> Reset
            </Button>
            <Button 
              variant="primary" 
              onClick={saveSettings}
              className="rounded-pill px-4"
              disabled={saving}
            >
              <FaSave className="me-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="g-4">
        {/* ============ NOTIFICATIONS ============ */}
        <Col lg={6}>
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            padding: '24px',
            height: '100%'
          }}>
            <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>
              <FaBell className="me-2" /> Notifications
            </h5>
            
            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <div className="fw-semibold">Email Notifications</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Receive emails about course updates</div>
              </div>
              <Form.Check 
                type="switch"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <div className="fw-semibold">Push Notifications</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Receive browser notifications</div>
              </div>
              <Form.Check 
                type="switch"
                checked={settings.pushNotifications}
                onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <div className="fw-semibold">Course Updates</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Get notified about new content</div>
              </div>
              <Form.Check 
                type="switch"
                checked={settings.courseUpdates}
                onChange={(e) => setSettings({...settings, courseUpdates: e.target.checked})}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center py-2">
              <div>
                <div className="fw-semibold">Marketing Emails</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Receive promotional content</div>
              </div>
              <Form.Check 
                type="switch"
                checked={settings.marketingEmails}
                onChange={(e) => setSettings({...settings, marketingEmails: e.target.checked})}
              />
            </div>
          </Card>
        </Col>

        {/* ============ APPEARANCE ============ */}
        <Col lg={6}>
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            padding: '24px',
            height: '100%'
          }}>
            <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>
              <FaPalette className="me-2" /> Appearance
            </h5>

            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <div className="fw-semibold"><FaMoon className="me-2" /> Dark Mode</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Switch between light and dark theme</div>
              </div>
              <Form.Check 
                type="switch"
                checked={settings.darkMode}
                onChange={(e) => {
                  setSettings({...settings, darkMode: e.target.checked});
                  // Apply dark mode immediately
                  if (e.target.checked) {
                    document.body.style.background = '#0F172A';
                    document.body.style.color = '#F1F5F9';
                  } else {
                    document.body.style.background = '';
                    document.body.style.color = '';
                  }
                }}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <div className="fw-semibold"><FaFont className="me-2" /> Font Size</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Adjust text size</div>
              </div>
              <Form.Select
                value={settings.fontSize}
                onChange={(e) => setSettings({...settings, fontSize: e.target.value})}
                style={{ width: '140px' }}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </Form.Select>
            </div>

            <div className="d-flex justify-content-between align-items-center py-2">
              <div>
                <div className="fw-semibold"><FaLanguage className="me-2" /> Language</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Choose your preferred language</div>
              </div>
              <Form.Select
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                style={{ width: '140px' }}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
              </Form.Select>
            </div>
          </Card>
        </Col>

        {/* ============ PRIVACY ============ */}
        <Col lg={6}>
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            padding: '24px',
            height: '100%'
          }}>
            <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>
              <FaShieldAlt className="me-2" /> Privacy
            </h5>

            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <div className="fw-semibold">Profile Visibility</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Who can see your profile</div>
              </div>
              <Form.Select
                value={settings.profileVisibility}
                onChange={(e) => setSettings({...settings, profileVisibility: e.target.value})}
                style={{ width: '140px' }}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </Form.Select>
            </div>

            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <div className="fw-semibold">Show Progress</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Display learning progress</div>
              </div>
              <Form.Check 
                type="switch"
                checked={settings.showProgress}
                onChange={(e) => setSettings({...settings, showProgress: e.target.checked})}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center py-2">
              <div>
                <div className="fw-semibold">Show Enrolled Courses</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Display courses you're enrolled in</div>
              </div>
              <Form.Check 
                type="switch"
                checked={settings.showEnrolledCourses}
                onChange={(e) => setSettings({...settings, showEnrolledCourses: e.target.checked})}
              />
            </div>
          </Card>
        </Col>

        {/* ============ DISPLAY ============ */}
        <Col lg={6}>
          <Card style={{
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            padding: '24px',
            height: '100%'
          }}>
            <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>
              <FaGlobe className="me-2" /> Display Settings
            </h5>

            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <div className="fw-semibold">Compact View</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Show more content per page</div>
              </div>
              <Form.Check 
                type="switch"
                checked={settings.compactView}
                onChange={(e) => setSettings({...settings, compactView: e.target.checked})}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <div className="fw-semibold">Show Thumbnails</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Display course thumbnails</div>
              </div>
              <Form.Check 
                type="switch"
                checked={settings.showThumbnails}
                onChange={(e) => setSettings({...settings, showThumbnails: e.target.checked})}
              />
            </div>

            <div className="d-flex justify-content-between align-items-center py-2">
              <div>
                <div className="fw-semibold">Auto-Play Videos</div>
                <div className="text-muted" style={{ fontSize: '14px' }}>Automatically play lesson videos</div>
              </div>
              <Form.Check 
                type="switch"
                checked={settings.autoPlay}
                onChange={(e) => setSettings({...settings, autoPlay: e.target.checked})}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Save button at bottom */}
      <div className="d-flex justify-content-center mt-4">
        <Button 
          variant="primary" 
          onClick={saveSettings}
          className="rounded-pill px-5 py-3"
          disabled={saving}
          style={{ fontSize: '18px' }}
        >
          <FaSave className="me-2" />
          {saving ? 'Saving...' : '💾 Save All Settings'}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Settings;