import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings';
import Analytics from './Pages/Analytics';
import CourseList from './Pages/CourseList';
import CourseDetails from './Pages/CourseDetails';
import CreateCourse from './Pages/CreateCourse';
import ManageCourse from './Pages/ManageCourse';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          } />
          <Route path="/courses/:id" element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          } />
          <Route path="/create-course" element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          } />
          <Route path="/manage-course/:id" element={
            <ProtectedRoute>
              <ManageCourse />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;