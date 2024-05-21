// src/components/CompanyComponent.js

import { useNavigate } from 'react-router-dom';
import jobBackends, { workdayJobs } from '../constants/jobUrls';
import CompanyNameCard from '../components/Cards/CompanyNameCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../constants';
import { SkeletonCardLoader } from '../ui/JobPostingSkeleton';

const Home = () => {
  const [companyList, setCompanyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  console.log(companyList);

  const handleCompanyClick = async (company: any) => {
    navigate(`/jobs/${company.slug}`);
    console.log('COMPANY CLICKED', company);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchCompanyList = async () => {
      try {
        const { data } = await axios.get(`${API.BASE_URL}${API.COMPANIES}`);
        setCompanyList(data);
      } catch (error) {
        console.error('Error fetching company list:', error);
      }
    };
    fetchCompanyList();
    setIsLoading(false);
  }, []);

  return (
    <div className='w-full flex flex-col items-center justify-start gap-4'>
      <h2 className='text-lg font-bold'>
        Welcome to the job board! Here you can find job listings for different
        companies.
      </h2>
      <h3 className='text-xl font-semibold text-center'>
        All Companies ({companyList?.length})
      </h3>

      <div className='flex-wrap grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
        {isLoading
          ? Array.from({ length: 10 }, (_, index) => (
              <SkeletonCardLoader key={index} />
            ))
          : companyList?.map((company, idx) => (
              <CompanyNameCard
                key={idx}
                company={company}
                onClick={() => handleCompanyClick(company)}
              />
            ))}
      </div>
    </div>
  );
};

export default Home;
