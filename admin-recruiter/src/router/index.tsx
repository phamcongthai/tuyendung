import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import RecruiterList from '../pages/Recruiters/index';
import CreateRecruiter from '../pages/Recruiters/CreateRecruiter';
import RecruiterDetail from '../pages/Recruiters/RecruiterDetail';
import EditRecruiter from '../pages/Recruiters/EditRecruiter';
import JobsList from '../pages/Jobs/index'
import CreateJob from './../pages/Jobs/CreateJob';
import JobDetail from '../pages/Jobs/JobDetail';
const AppRouter = () => {
  console.log('AppRouter rendered, current pathname:', window.location.pathname);
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/recruiters" element={<RecruiterList />} />
      <Route path="/recruiters/create" element={<CreateRecruiter />} />
      <Route path="/recruiters/edit/:id" element={<EditRecruiter />} />
      <Route path="/recruiters/detail/:id" element={<RecruiterDetail />} />

      <Route path='/jobs' element={<JobsList/>}/>
      <Route path="/jobs/create" element={<CreateJob />} />
      <Route path="/jobs/detail/:id" element={<JobDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter; 