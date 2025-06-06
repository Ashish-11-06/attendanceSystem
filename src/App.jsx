import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
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

function InactivityHandler({ timeout = 60000 }) {
  const navigate = useNavigate();

  useEffect(() => {
    const LAST_ACTIVE_KEY = 'lastActiveTime';
    let timer;

    const handleLogout = () => {
      if (localStorage.getItem('user')) {
        localStorage.removeItem('user');
        localStorage.removeItem(LAST_ACTIVE_KEY);
        alert('Logged out due to inactivity.');
        navigate('/login', { replace: true });
      }
    };

    const resetTimer = () => {
      clearTimeout(timer);
      const now = new Date().toISOString();
      localStorage.setItem(LAST_ACTIVE_KEY, now);
      timer = setTimeout(handleLogout, timeout);
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];
    activityEvents.forEach((event) => window.addEventListener(event, resetTimer));

    // Set initial timestamp and timer
    resetTimer();

    return () => {
      clearTimeout(timer);
      activityEvents.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, timeout]);

  return null;
}

function AuthGuard({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
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
      <div
        style={{
          position: 'fixed',
          top: 20,
          left: 0,
          right: 0,
          zIndex: 9999,
          textAlign: 'center',
          background: '#ffdddd',
          color: '#a00',
          padding: '12px',
          fontWeight: 'bold',
        }}
      >
        You are not logged in
      </div>
    );
  }

  return children;
}

function ShowLastActive() {
  const [lastActive, setLastActive] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const storedTime = localStorage.getItem('lastActiveTime');
      if (storedTime) {
        const formatted = new Date(storedTime).toLocaleString();
        setLastActive(formatted);
      }
    };

    updateTime();

    const intervalId = setInterval(updateTime, 10000); // update every 10s
    return () => clearInterval(intervalId);
  }, []);

  
}

function App() {
  return (
    <Router>
      <AuthGuard>
         <InactivityHandler timeout={28800000} />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="*"
            element={
              <AppLayout>
                <ShowLastActive />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/events-list" element={<EventList />} />
                  <Route path="/unit-list" element={<UnitList />} />
                  <Route path="/volunteer-list" element={<VolunteerList />} />
                  <Route path="/location-list" element={<LocationList />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/attendance-list" element={<Attendance_list />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/shru" element={<Shru />} />
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
