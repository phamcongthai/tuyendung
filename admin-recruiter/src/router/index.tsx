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
import EditJob from '../pages/Jobs/EditJob';
import JobCategoriesList from '../pages/JobCategories/index';
import CreateJobCategory from '../pages/JobCategories/CreateJobCategory';
import EditJobCategory from '../pages/JobCategories/EditJobCategory';
import JobCategoryDetail from '../pages/JobCategories/JobCategoryDetail';
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
      <Route path="/jobs/edit/:id" element={<EditJob />} />

      <Route path="/job-categories" element={<JobCategoriesList />} />
      <Route path="/job-categories/create" element={<CreateJobCategory />} />
      <Route path="/job-categories/detail/:id" element={<JobCategoryDetail />} />
      <Route path="/job-categories/edit/:id" element={<EditJobCategory />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter; 