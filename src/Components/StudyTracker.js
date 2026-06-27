import React, { useState, useEffect } from 'react';
import { FaFire, FaClock, FaCalendarCheck, FaBrain, FaRocket, FaBell, FaStopwatch } from 'react-icons/fa';

const StudyTracker = () => {
  // Study streak (days in a row)
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('studyStreak');
    return saved ? parseInt(saved) : 0;
  });

  // Today's study time (in minutes)
  const [todayStudyTime, setTodayStudyTime] = useState(() => {
    const saved = localStorage.getItem('todayStudyTime');
    return saved ? parseInt(saved) : 0;
  });

  // Daily goal (minutes)
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem('dailyGoal');
    return saved ? parseInt(saved) : 30;
  });

  // Study sessions
  const [studySessions, setStudySessions] = useState(() => {
    const saved = localStorage.getItem('studySessions');
    return saved ? JSON.parse(saved) : [];
  });

  // Reminder settings
  const [reminderTime, setReminderTime] = useState(() => {
    const saved = localStorage.getItem('reminderTime');
    return saved || '09:00';
  });

  const [showReminder, setShowReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');

  // Check for study reminders
  useEffect(() => {
    const checkReminder = () => {
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      
      if (currentTime === reminderTime) {
        setReminderMessage("⏰ Time to study! Don't break your streak! 🔥");
        setShowReminder(true);
        setTimeout(() => setShowReminder(false), 10000);
      }
    };

    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, [reminderTime]);

  // Update streak daily
  useEffect(() => {
    const lastStudyDate = localStorage.getItem('lastStudyDate');
    const today = new Date().toDateString();

    if (lastStudyDate !== today) {
      // If last study was yesterday, keep streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastStudyDate === yesterday.toDateString()) {
        // Streak continues
      } else if (lastStudyDate !== null) {
        // Streak broken
        setStreak(0);
        localStorage.setItem('studyStreak', '0');
      }
    }
  }, []);

  const startStudySession = () => {
    const startTime = new Date();
    const sessionId = Date.now();
    
    // Add a new session
    setStudySessions(prev => [...prev, {
      id: sessionId,
      startTime: startTime.toISOString(),
      endTime: null,
      duration: 0,
      completed: false
    }]);
    
    localStorage.setItem('studySessions', JSON.stringify(studySessions));
  };

  const endStudySession = () => {
    const now = new Date();
    const lastSession = studySessions[studySessions.length - 1];
    
    if (lastSession && !lastSession.completed) {
      const start = new Date(lastSession.startTime);
      const duration = Math.floor((now - start) / 60000); // minutes
      
      const updatedSessions = studySessions.map((s, i) => {
        if (i === studySessions.length - 1) {
          return { ...s, endTime: now.toISOString(), duration, completed: true };
        }
        return s;
      });
      
      setStudySessions(updatedSessions);
      localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
      
      // Update today's study time
      const newTotal = todayStudyTime + duration;
      setTodayStudyTime(newTotal);
      localStorage.setItem('todayStudyTime', newTotal.toString());
      
      // Check if daily goal is met
      if (newTotal >= dailyGoal) {
        setReminderMessage("🎉 Congratulations! You've met your daily study goal! Keep it up! 🚀");
        setShowReminder(true);
        setTimeout(() => setShowReminder(false), 8000);
      }
      
      // Update streak
      const today = new Date().toDateString();
      const lastStudyDate = localStorage.getItem('lastStudyDate');
      
      if (lastStudyDate !== today) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('studyStreak', newStreak.toString());
        localStorage.setItem('lastStudyDate', today);
      }
    }
  };

  // Get today's completed sessions
  const todaySessions = studySessions.filter(s => {
    if (!s.completed) return false;
    const sessionDate = new Date(s.startTime).toDateString();
    return sessionDate === new Date().toDateString();
  });

  const totalStudyMinutes = todaySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const progress = Math.min((totalStudyMinutes / dailyGoal) * 100, 100);

  return (
    <div className="study-tracker">
      {/* ============ REMINDER NOTIFICATION ============ */}
      {showReminder && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          color: 'white',
          padding: '20px 28px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(79, 70, 229, 0.4)',
          zIndex: 2000,
          maxWidth: '400px',
          animation: 'slideInRight 0.5s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🔔</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '16px' }}>Study Reminder</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>{reminderMessage}</div>
            </div>
            <button
              onClick={() => setShowReminder(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ============ HEADER ============ */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>
            📚 Study Tracker
          </h2>
          <p style={{ color: '#94A3B8', margin: 0, fontSize: '14px' }}>
            Track your learning progress and stay motivated!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            padding: '8px 16px',
            borderRadius: '30px',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <FaFire /> {streak} Day Streak
          </div>
        </div>
      </div>

      {/* ============ STATS CARDS ============ */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '4px' }}>⏱️</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#4F46E5' }}>
              {Math.floor(totalStudyMinutes / 60)}h {totalStudyMinutes % 60}m
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Today</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '4px' }}>🎯</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981' }}>
              {Math.round(progress)}%
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Goal Progress</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '4px' }}>📝</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#7C3AED' }}>
              {todaySessions.length}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Sessions Today</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '4px' }}>🔥</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444' }}>
              {streak}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Day Streak</div>
          </div>
        </div>
      </div>

      {/* ============ PROGRESS BAR ============ */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600 }}>Daily Study Goal</span>
          <span>{totalStudyMinutes}m / {dailyGoal}m</span>
        </div>
        <div style={{
          height: '8px',
          background: '#E2E8F0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(progress, 100)}%`,
            height: '100%',
            background: progress >= 100 
              ? 'linear-gradient(90deg, #10B981, #059669)' 
              : 'linear-gradient(90deg, #4F46E5, #7C3AED)',
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>

      {/* ============ STUDY CONTROLS ============ */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '16px'
      }}>
        <button
          onClick={startStudySession}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <FaStopwatch /> Start Study Session
        </button>
        <button
          onClick={endStudySession}
          style={{
            padding: '12px 24px',
            background: 'white',
            color: '#4F46E5',
            border: '2px solid #4F46E5',
            borderRadius: '30px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#4F46E5';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white';
            e.target.style.color = '#4F46E5';
          }}
        >
          <FaClock /> End Session
        </button>
        <button
          onClick={() => {
            const newGoal = prompt('Set your daily study goal (in minutes):', dailyGoal);
            if (newGoal && !isNaN(newGoal)) {
              setDailyGoal(parseInt(newGoal));
              localStorage.setItem('dailyGoal', newGoal);
            }
          }}
          style={{
            padding: '12px 24px',
            background: '#F1F5F9',
            color: '#1E293B',
            border: 'none',
            borderRadius: '30px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaRocket /> Set Goal
        </button>
        <button
          onClick={() => {
            const time = prompt('Set daily reminder time (HH:MM, e.g., 09:00):', reminderTime);
            if (time && /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
              setReminderTime(time);
              localStorage.setItem('reminderTime', time);
              alert(`✅ Reminder set for ${time} daily!`);
            } else if (time) {
              alert('❌ Invalid time format. Use HH:MM (e.g., 09:00)');
            }
          }}
          style={{
            padding: '12px 24px',
            background: '#FEF2F2',
            color: '#EF4444',
            border: 'none',
            borderRadius: '30px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaBell /> Set Reminder
        </button>
      </div>

      {/* ============ RECENT SESSIONS ============ */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
          📋 Recent Study Sessions
        </h4>
        {studySessions.filter(s => s.completed).length === 0 ? (
          <p style={{ color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>
            No study sessions yet. Start your first session! 🚀
          </p>
        ) : (
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {studySessions.filter(s => s.completed).reverse().slice(0, 10).map((session, index) => (
              <div
                key={session.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: index < 9 ? '1px solid #F1F5F9' : 'none'
                }}
              >
                <div>
                  <span style={{ fontWeight: 500 }}>
                    Session #{studySessions.filter(s => s.completed).length - index}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94A3B8', marginLeft: '12px' }}>
                    {new Date(session.startTime).toLocaleTimeString()}
                  </span>
                </div>
                <span style={{ fontWeight: 600, color: '#4F46E5' }}>
                  {session.duration}m
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============ ANIMATION STYLES ============ */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default StudyTracker;