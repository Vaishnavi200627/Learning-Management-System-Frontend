import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaMinus, FaExpand } from 'react-icons/fa';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI learning assistant. Ask me anything about your courses!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sample knowledge base
  const knowledgeBase = {
    'html': 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It defines the structure of web content using elements like headings, paragraphs, links, images, and more.',
    'css': 'CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, and responsive design. Key concepts include flexbox, grid, and media queries.',
    'javascript': 'JavaScript is a programming language that adds interactivity to websites. It can manipulate the DOM, handle events, make API calls, and create dynamic content.',
    'react': 'React is a JavaScript library for building user interfaces. It uses components, props, and state to create reusable UI elements. Key concepts include JSX, hooks, and the virtual DOM.',
    'nodejs': 'Node.js is a JavaScript runtime that allows you to run JavaScript on the server. It\'s built on Chrome\'s V8 engine and is used for building scalable network applications.',
    'mongodb': 'MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents. It\'s designed for scalability and high performance.',
    'express': 'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
    'api': 'An API (Application Programming Interface) is a set of rules that allows different software applications to communicate with each other. REST APIs use HTTP methods like GET, POST, PUT, DELETE.',
    'database': 'A database is an organized collection of data stored electronically. Common types include relational (SQL) databases like MySQL and NoSQL databases like MongoDB.',
    'learning': 'Our LMS offers courses in Web Development, Data Science, AI, Cloud Computing, and more. Each course includes video lessons, text content, and quizzes to test your knowledge.'
  };

  const getBotResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return "Hello! 👋 How can I help you with your learning today?";
    }
    
    if (lowerMsg.includes('course') || lowerMsg.includes('learn') || lowerMsg.includes('study')) {
      return "We offer courses in Web Development, Data Science, AI & ML, Cloud Computing, DevOps, and Cybersecurity. Which one interests you?";
    }
    
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (lowerMsg.includes(key)) {
        return value;
      }
    }
    
    return "That's a great question! I'd recommend checking the course materials or asking your instructor for more details. Try asking about HTML, CSS, JavaScript, React, Node.js, MongoDB, or APIs.";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');
    setIsTyping(true);
    
    setTimeout(() => {
      const response = getBotResponse(input);
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* ============ CHAT TOGGLE BUTTON - BIG & VISIBLE ============ */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: 'white',
            border: 'none',
            fontSize: '36px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(79, 70, 229, 0.5)',
            zIndex: 1000,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulseGlow 2s ease-in-out infinite'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 12px 48px rgba(79, 70, 229, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 8px 32px rgba(79, 70, 229, 0.5)';
          }}
        >
          <FaRobot />
          {/* Notification dot */}
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#EF4444',
            border: '3px solid white',
            animation: 'pulseDot 1.5s ease-in-out infinite'
          }} />
        </button>
      )}

      {/* ============ CHAT WINDOW ============ */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: isMinimized ? '80px' : '420px',
          maxWidth: '90%',
          height: isMinimized ? '80px' : '560px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 999,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* Header */}
          <div style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>AI Assistant</div>
                <div style={{ fontSize: '12px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#34D399',
                    display: 'inline-block',
                    animation: 'pulseDot 1.5s ease-in-out infinite'
                  }} />
                  Online • Ready to help
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
              >
                {isMinimized ? <FaExpand /> : <FaMinus />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                background: '#F8FAFC'
              }}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '14px'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '14px 20px',
                        borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        background: msg.sender === 'user' 
                          ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' 
                          : 'white',
                        color: msg.sender === 'user' ? 'white' : '#1E293B',
                        boxShadow: msg.sender === 'user' 
                          ? '0 4px 15px rgba(79, 70, 229, 0.3)' 
                          : '0 2px 10px rgba(0,0,0,0.05)',
                        wordWrap: 'break-word',
                        fontSize: '15px',
                        lineHeight: '1.6'
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '14px' }}>
                    <div style={{
                      padding: '14px 20px',
                      borderRadius: '20px 20px 20px 4px',
                      background: 'white',
                      color: '#94A3B8',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      fontSize: '15px'
                    }}>
                      <span style={{ animation: 'dots 1.5s infinite' }}>Typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: '16px 20px',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                gap: '12px',
                background: 'white',
                flexShrink: 0
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    border: '2px solid #E2E8F0',
                    borderRadius: '14px',
                    outline: 'none',
                    fontSize: '15px',
                    transition: 'all 0.3s ease',
                    background: '#F8FAFC'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4F46E5';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E2E8F0';
                    e.target.style.background = '#F8FAFC';
                  }}
                />
                <button
                  onClick={handleSend}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Send <FaPaperPlane size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ============ ANIMATION STYLES ============ */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 8px 32px rgba(79, 70, 229, 0.5);
          }
          50% {
            box-shadow: 0 8px 48px rgba(79, 70, 229, 0.7);
          }
        }
        
        @keyframes pulseDot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.85);
          }
        }
        
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60% { content: '...'; }
          80%, 100% { content: ''; }
        }
      `}</style>
    </>
  );
};

export default Chatbot;