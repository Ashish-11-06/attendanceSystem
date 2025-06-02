import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
