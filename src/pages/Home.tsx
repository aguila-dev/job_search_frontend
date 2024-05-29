// src/components/CompanyComponent.js

import { useNavigate } from 'react-router-dom';
import CompanyNameCard from '../components/Cards/CompanyNameCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../constants';
import { SkeletonCardLoader } from '../ui/JobPostingSkeleton';
import Search from '../components/Search';

const Home = () => {
  const [companyList, setCompanyList] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleCompanyClick = async (company: any) => {
    navigate(`/jobs/${company.slug}`);
    console.log('COMPANY CLICKED', company);
  };

  useEffect(() => {
    console.log('Fetching company list...');
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

  const handleSearchSubmit = async (query: string) => {
    console.log('Searching for companies with query:', query);
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${API.BASE_URL}${API.COMPANIES}?name=${query}`
      );
      setCompanyList(data);
    } catch (error) {
      console.error('Error searching for companies:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className='w-full max-w-6xl flex flex-col items-center justify-start gap-4'>
      <h2 className='text-lg font-bold'>
        Welcome to the job board! Here you can find job listings for different
        companies.
      </h2>
      <Search onSubmitSearch={handleSearchSubmit} />
      <h3 className='text-xl font-semibold text-center'>
        All Companies ({companyList?.length})
      </h3>

      <section className='w-full overflow-y-auto h-[55dvh] md:h-[65dvh] lg:h-[70dvh] p-2'>
        <div className='flex-wrap grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
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
      </section>
    </div>
  );
};

export default Home;
