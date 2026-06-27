import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const CourseCard = ({ course }) => {
  const { user } = useAuth();
  const isInstructor = user?.role === 'instructor' && user?._id === course.instructor?._id;
  
  const [rating] = useState(() => {
    const baseRating = 3.5 + Math.random() * 1.5;
    return Math.min(baseRating, 5.0);
  });
  
  const [reviews] = useState(() => Math.floor(10 + Math.random() * 490));
  const studentCount = course.enrolledStudents?.length || Math.floor(50 + Math.random() * 950);
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} style={{ color: '#F59E0B', fontSize: '12px' }} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} style={{ color: '#F59E0B', fontSize: '12px' }} />);
      } else {
        stars.push(<FaRegStar key={i} style={{ color: '#D1D5DB', fontSize: '12px' }} />);
      }
    }
    return stars;
  };

  return (
    <div className="course-card" style={{ 
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="image-wrapper" style={{
        position: 'relative',
        height: '180px',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <img 
          src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=240&fit=crop'} 
          alt={course.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <span className="badge-top" style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 600
        }}>
          {course.category || 'General'}
        </span>
        {course.price > 0 && (
          <span className="badge-price" style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(79, 70, 229, 0.9)',
            color: 'white',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 700
          }}>
            ${course.price}
          </span>
        )}
      </div>
      
      <div className="body" style={{
        padding: '16px 18px 18px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h4 className="title" style={{
            fontSize: '17px',
            fontWeight: 700,
            marginBottom: '4px',
            color: '#1E293B',
            lineHeight: 1.3,
            flex: 1
          }}>
            {course.title}
          </h4>
          {course.price === 0 && (
            <span style={{
              background: '#10B981',
              color: 'white',
              fontSize: '10px',
              padding: '2px 10px',
              borderRadius: '20px',
              fontWeight: 600,
              flexShrink: 0,
              marginLeft: '8px'
            }}>
              FREE
            </span>
          )}
        </div>
        
        <p className="instructor" style={{
          color: '#94A3B8',
          fontSize: '13px',
          marginBottom: '6px'
        }}>
          👨‍🏫 {course.instructor?.name || 'Unknown Instructor'}
        </p>
        
        <div className="rating" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '6px'
        }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {renderStars(rating)}
          </div>
          <span style={{ fontWeight: 600, color: '#1E293B', fontSize: '13px' }}>
            {rating.toFixed(1)}
          </span>
          <span style={{ color: '#94A3B8', fontSize: '12px' }}>
            ({reviews.toLocaleString()})
          </span>
        </div>
        
        <p className="description" style={{
          color: '#94A3B8',
          fontSize: '13px',
          lineHeight: '1.5',
          marginBottom: '10px',
          flex: 1
        }}>
          {course.description?.substring(0, 70)}...
        </p>
        
        <div style={{
          fontSize: '12px',
          color: '#94A3B8',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>👨‍🎓</span>
          <span>{studentCount.toLocaleString()} students</span>
        </div>
        
        <div className="footer" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '10px',
          borderTop: '1px solid #F1F5F9',
          marginTop: 'auto'
        }}>
          <span className="price" style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#4F46E5'
          }}>
            ${course.price || 0}
          </span>
          <Link to={`/courses/${course._id}`} className="btn btn-primary" style={{
            padding: '6px 18px',
            fontSize: '13px',
            borderRadius: '30px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            color: 'white',
            border: 'none',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}>
            View
          </Link>
        </div>
        
        {isInstructor && (
          <Link 
            to={`/manage-course/${course._id}`}
            className="btn btn-outline-secondary w-100 mt-2 rounded-pill"
            style={{ 
              fontSize: '12px', 
              padding: '4px 12px',
              textAlign: 'center',
              border: '1px solid #E2E8F0',
              borderRadius: '30px',
              color: '#64748B',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            ⚙️ Manage
          </Link>
        )}
      </div>
    </div>
  );
};

export default CourseCard;