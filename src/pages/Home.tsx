// src/components/CompanyComponent.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchJobs from '../api/jobsAPI';
import jobBackends, { workdayJobs } from '../constants/jobUrls';

const Home = () => {
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    const getJobs = async () => {
      const jobsData = await fetchJobs(jobBackends[0].url);
      if (!jobsData) {
        return; // Handle the error
      }
    };

    getJobs();
  }, []); // The empty array ensures this effect runs only once after the initial render

  const handleCompanyClick = async (backend: any, workday?: boolean) => {
    if (workday) {
      navigate(`/workday/${backend.name}`);
      return;
    }
    navigate(`/${backend.name}`);
  };

  return (
    <div className='w-full flex flex-col items-center justify-start gap-4'>
      <h2 className='text-xl font-semibold text-center'>
        Greenhouse Companies ({jobBackends.length})
      </h2>
      <div className='flex-wrap grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {jobBackends.map(
          (company, index) =>
            company.active && (
              <button
                key={index}
                onClick={() => handleCompanyClick(company)}
                className='company-name-btn'
                type='button'
              >
                {company.title}
              </button>
            )
        )}
      </div>
      <h2 className='text-xl font-semibold text-center'>
        Workday Companies ({workdayJobs.length})
      </h2>
      <div className='flex-wrap grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {workdayJobs.map((company, index) => (
          <button
            key={index}
            onClick={() => handleCompanyClick(company, true)}
            className='company-name-btn'
            type='button'
          >
            {company.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
