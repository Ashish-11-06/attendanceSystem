import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AppLayout from './components/Layout';

import Home from './Pages/Home';
import EventList from './Pages/EventList';
import Shru from './Pages/shru';
import UnitList from './Pages/UnitList';
import VolunteerList from './Pages/VolunteerList';
import LocationList from './Pages/LocationList';
import Profile from './Pages/Profile';
import Attendance from './Pages/Attendance';
import Attendance_list from './Pages/Attendance_list';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';

function AuthGuard({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const publicPaths = ['/login', '/signup'];
    if (!user && !publicPaths.includes(location.pathname)) {
      setShowMsg(true);
      setTimeout(() => {
        setShowMsg(false);
        navigate('/login', { replace: true });
      }, 1200);
    }
  }, [location, navigate]);

  if (showMsg) {
    return (
      <div style={{
        position: 'fixed',
        top: 20,
        left: 0,
        right: 0,
        zIndex: 9999,
        textAlign: 'center',
        background: '#ffdddd',
        color: '#a00',
        padding: '12px',
        fontWeight: 'bold'
      }}>
        You are not logged in
      </div>
    );
  }

  return children;
}

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('user',user);
  
  return (
    <Router>
      <AuthGuard>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events-list" element={<EventList />} />
                  <Route path="/unit-list" element={<UnitList />} />
                  <Route path="/volunteer-list" element={<VolunteerList />} />
                  <Route path="/location-list" element={<LocationList />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/attendance-list" element={<Attendance_list />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </AuthGuard>
    </Router>
  );
}

export default App;
