import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AllJobPostingsComponent from './pages/AllJobPostingsComponent';
import AppliedJobsComponent from './pages/AppliedJobs';
import { useAppSelector } from './redux/store';
import ProtectedRoutes from './ProtectedRoutes';
import AuthComponent from './components/Auth/AuthComponent';

const AppRoutes = () => {
  const { token, loading, error } = useAppSelector((state) => state.auth);
  return (
    <Routes>
      {!token ? (
        <>
          <Route path='/auth' element={<AuthComponent />} />
          <Route path='/*' element={<Navigate to='/auth' replace />} />
        </>
      ) : (
        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<Home />} />
          <Route path='/jobs/:company' element={<AllJobPostingsComponent />} />
          <Route
            path='/profile/applied-jobs'
            element={<AppliedJobsComponent />}
          />
          <Route
            path='/jobs/todays-jobs'
            element={<AllJobPostingsComponent isTodaysJobs={true} />}
          />
        </Route>
      )}
      <Route path='/*' element={<div> Error 404</div>} />
    </Routes>
  );
};

export default AppRoutes;
