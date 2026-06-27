import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import api from '../services/Api';
import CourseCard from '../Components/CourseCard';
import categories from '../Data/Categories';

const CourseList = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, selectedCategory, courses]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCourses(filtered);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div style={{ fontSize: '24px' }}>⏳ Loading courses...</div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 700 }}>📚 All Courses</h2>
          <p style={{ color: '#94A3B8' }}>
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
          </p>
        </div>
        {user?.role === 'instructor' && (
          <Link to="/create-course" className="btn btn-primary rounded-pill px-4">
            ➕ Create Course
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        <div style={{ 
          flex: 1, 
          minWidth: '250px',
          display: 'flex',
          background: 'white',
          borderRadius: '30px',
          padding: '4px 4px 4px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #E2E8F0',
          alignItems: 'center'
        }}>
          <FaSearch style={{ color: '#94A3B8', fontSize: '16px' }} />
          <input
            type="text"
            placeholder="Search courses by title or description..."
            className="form-control"
            style={{
              border: 'none',
              outline: 'none',
              padding: '12px 16px',
              fontSize: '15px',
              background: 'transparent',
              boxShadow: 'none'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                padding: '8px 12px',
                cursor: 'pointer'
              }}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <select 
          className="form-select"
          style={{
            width: '200px',
            borderRadius: '30px',
            padding: '12px 20px',
            border: '1px solid #E2E8F0',
            background: 'white',
            fontSize: '15px'
          }}
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
          ))}
        </select>

        {(searchTerm || selectedCategory !== 'all') && (
          <button 
            className="btn btn-outline-secondary rounded-pill px-4"
            onClick={handleClear}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Course Cards */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-5" style={{
          background: 'white',
          borderRadius: '20px',
          padding: '60px 20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontWeight: 600 }}>No courses found</h3>
          <p style={{ color: '#94A3B8' }}>
            {searchTerm ? `No results for "${searchTerm}"` : 'No courses in this category yet'}
          </p>
          {(searchTerm || selectedCategory !== 'all') && (
            <button 
              className="btn btn-primary rounded-pill px-4"
              onClick={handleClear}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <Row className="g-4">
          {filteredCourses.map(course => (
            <Col key={course._id} xs={12} sm={6} lg={4} xl={3}>
              <CourseCard course={course} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CourseList;