import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AllJobPostingsComponent from './pages/AllJobPostingsComponent';
import AppliedJobsComponent from './pages/AppliedJobs';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/jobs/:company' element={<AllJobPostingsComponent />} />
      <Route path='/profile/applied-jobs' element={<AppliedJobsComponent />} />
      <Route
        path='/jobs/todays-jobs'
        element={<AllJobPostingsComponent isTodaysJobs={true} />}
      />
      <Route path='/*' element={<div> Error 404</div>} />
    </Routes>
  );
};

export default AppRoutes;
