// src/components/CompanyComponent.js

import { useNavigate } from 'react-router-dom';
import jobBackends, { workdayJobs } from '../constants/jobUrls';
import CompanyNameCard from '../components/Cards/CompanyNameCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../constants';

const Home = () => {
  const navigate = useNavigate(); // Get the navigate function
  const [companyList, setCompanyList] = useState([]); // Create a state variable to store the jobs
  console.log('COMPANY LIST', companyList);
  const handleCompanyClick = async (backend: any, workday?: boolean) => {
    if (workday) {
      navigate(`/workday/${backend.name}`);
      return;
    }
    navigate(`/${backend.name}`);
  };

  useEffect(() => {
    const fetchCompanyList = async () => {
      try {
        const { data } = await axios.get(`${API.BASE_URL}${API.COMPANIES}`);
        setCompanyList(data);
      } catch (error) {
        console.error('Error fetching company list:', error);
      }
    };
    fetchCompanyList();
  }, []);

  return (
    <div className='w-full flex flex-col items-center justify-start gap-4'>
      <h2>
        Welcome to the job board! Here you can find job listings for different
        companies.
      </h2>
      <h3 className='text-xl font-semibold text-center'>
        All Companies ({companyList?.length})
      </h3>

      <div className='flex-wrap grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {companyList?.map((company, idx) => (
          <CompanyNameCard
            key={idx}
            company={company}
            onClick={() => handleCompanyClick(company)}
          />
        ))}
      </div>
      {/* <h3 className='text-xl font-semibold text-center'>
        Greenhouse Companies ({jobBackends.length})
      </h3> */}
      {/* <div className='flex-wrap grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {jobBackends.map(
          (company) =>
            company.active && (
              <CompanyNameCard
                key={company.title}
                company={company}
                onClick={() => handleCompanyClick(company)}
              />
            )
        )}
      </div>
      <h3 className='text-xl font-semibold text-center'>
        Workday Companies ({workdayJobs.length})
      </h3>
      <div className='flex-wrap grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {workdayJobs.map((company) => (
          <CompanyNameCard
            key={company.title}
            company={company}
            onClick={() => handleCompanyClick(company, true)}
          />
        ))}
      </div> */}
    </div>
  );
};

export default Home;
