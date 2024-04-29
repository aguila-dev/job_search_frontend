import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetchJobs from '../api/jobsAPI'; // Adjust this import path as needed
import SinglePosting from '../components/Cards/SinglePosting'; // Adjust this import path as needed
import getBackendUrl from '../utils/getBackendUrl';
import SearchAndSort from '../components/SearchAndSort';
import JobPostingSkeleton from '../ui/JobPostingSkeleton';
import downloadAppliedJobDetails from '../utils/downloadJobDetails';
import { LoadingSpinner } from '../ui';

const GreenhouseCompanyJobsList = () => {
  const { company } = useParams(); // Extract the company name from the URL
  const [jobs, setJobs] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  console.log('isError', isError);

  const navigate = useNavigate();

  useEffect(() => {
    const getJobs = async (company: string) => {
      setIsLoading(true);
      setIsError(false);
      const backendUrl = getBackendUrl(company);
      if (!backendUrl) {
        navigate('/');
        return;
      }
      try {
        const jobsData = await fetchJobs(backendUrl);
        if (!jobsData) {
          throw new Error('Network response errored out');
        }
        const appliedJobs = JSON.parse(
          localStorage.getItem('appliedJobs') || '{}'
        );

        const jobsWithApplicationStatus = jobsData.map((job: any) => ({
          ...job,
          applied: !!appliedJobs[company]?.[job.id],
        }));

        setJobs(jobsWithApplicationStatus);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (company) {
      getJobs(company);
    }
  }, [company, navigate]);

  const filteredJobs = jobs.filter((job: any) =>
    job?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAndFilteredJobs = filteredJobs.sort((a: any, b: any) => {
    const dateA = new Date(a.updated_at).getTime(); // Convert to timestamp
    const dateB = new Date(b.updated_at).getTime(); // Convert to timestamp

    if (sortOrder === 'newest') {
      return dateB - dateA; // Ensure arithmetic operation is between numbers
    } else if (sortOrder === 'oldest') {
      return dateA - dateB; // Ensure arithmetic operation is between numbers
    }
    return 0;
  });

  const handleApplicationToggle = (jobId: number) => {
    // Retrieve the existing structure or initialize it if it doesn't exist
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '{}');
    if (company) {
      // Check if the company exists in the structure, if not, initialize it
      if (!appliedJobs[company]) {
        appliedJobs[company] = {};
      }

      // Toggle the application status for the job
      if (appliedJobs[company][jobId]) {
        delete appliedJobs[company][jobId]; // Remove if already applied
      } else {
        // Add job with details if not already applied
        const jobToSave = jobs.find((job) => job.id === jobId);
        if (jobToSave) {
          appliedJobs[company][jobId] = { ...jobToSave, applied: true };
          const dateApplied = new Date().toLocaleDateString();
          const fileContent = `Job ID: ${jobToSave.id}, Title: ${jobToSave.title}, Company: ${company}, Date Applied: ${dateApplied}\n`;
          downloadAppliedJobDetails(fileContent, `${company}-${jobId}.txt`);
        }
      }

      // Save the updated structure back to local storage
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));

      // Update the local component state to reflect the changes
      const updatedJobs = jobs.map((job) => ({
        ...job,
        applied: !!appliedJobs[company][job.id],
      }));
      setJobs(updatedJobs);
    }
  };

  return (
    <div className='px-4 w-full'>
      <h2 className='text-center font-semibold text-2xl'>
        Job Listings for {company?.toUpperCase()} (
        {jobs?.length ? (
          jobs.length
        ) : !isError ? (
          <LoadingSpinner width='w-6' height='h-6' />
        ) : (
          ''
        )}
        )
      </h2>

      {isError ? (
        <div className='flex items-start justify-center pt-4'>
          <div className='text-red-600 bg-white p-4 rounded-lg shadow-lg'>
            Network error, sorry. Please try again later.
          </div>
        </div>
      ) : (
        <SearchAndSort
          setSortOrder={setSortOrder}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
      )}
      <ul className='pt-2 jobs-list-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2'>
        {isLoading
          ? // Render skeletons when loading
            Array.from({ length: 10 }, (_, index) => (
              <li key={index} className='job-posting'>
                <JobPostingSkeleton />
              </li>
            ))
          : sortedAndFilteredJobs.map((job: any, jobIndex: number) => (
              <li
                key={jobIndex}
                className='job-posting flex flex-col justify-between'
              >
                <SinglePosting job={job} />
                <span
                  onClick={() => handleApplicationToggle(job.id)}
                  className={`hover:cursor-pointer ${
                    job?.applied ? 'applied-button' : 'apply-button'
                  }`}
                >
                  {job?.applied ? '✔ ' : 'Applied'}
                </span>
              </li>
            ))}
      </ul>
    </div>
  );
};

export default GreenhouseCompanyJobsList;
