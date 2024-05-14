import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
// import GreenhouseCompanyJobsListBackup from './pages/GreenhouseCompanyJobsListBackup';
import GreenhouseCompanyJobsList from './pages/GreenhouseCompanyJobsList';
import AppliedJobsComponent from './pages/AppliedJobs';
import WorkdayCompanyJobsList from './pages/WorkdayCompanyJobsList';
import TodaysJobsPostings from './pages/TodaysJobsPostings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/:company' element={<GreenhouseCompanyJobsList />} />
      <Route path='/applied-jobs' element={<AppliedJobsComponent />} />
      <Route path='/workday/:company' element={<WorkdayCompanyJobsList />} />
      <Route path='/todays-jobs' element={<TodaysJobsPostings />} />
    </Routes>
  );
};

export default AppRoutes;
