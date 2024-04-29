// Select element must have an accessible name: Element has no title attribute Microsoft Edge Toolsaxe/forms-label-title
import { useEffect, useState } from 'react';
import SinglePosting from '../components/Cards/SinglePosting';
import SearchAndSort from '../components/SearchAndSort';

const AppliedJobsComponent = () => {
  const [appliedJobs, setAppliedJobs] = useState<[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompany, setSelectedCompany] =
    useState<string>('All Companies');

  console.log('appliedJobs', appliedJobs);
  useEffect(() => {
    const allAppliedJobs = JSON.parse(
      localStorage.getItem('appliedJobs') || '{}'
    );

    // Create a list that includes both job details and the company name
    const jobsList = Object.entries(allAppliedJobs).flatMap(
      ([companyName, companyJobs]: any) =>
        Object.values(companyJobs).map((job: any) => ({
          ...job,
          company: companyName, // Add the company name to each job object
        }))
    );

    setAppliedJobs(jobsList as any);
  }, []);

  const filteredJobs = appliedJobs.filter(
    (job: any) =>
      job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job?.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job?.location?.name &&
        job.location.name.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const setOfCompanies = new Set(appliedJobs.map((job: any) => job.company));
  const companyOptions = [
    <option
      key='all'
      value='All Companies'
      title='all'
      label='all'
      aria-label='all'
    >
      All Companies
    </option>,
    ...Array.from(setOfCompanies).map((company, index) => (
      <option
        key={index}
        value={company}
        title={company}
        label={company}
        aria-label={company}
      >
        {company}
      </option>
    )),
  ];
  // Filter jobs based on the selected company
  const filteredByCompany = sortedAndFilteredJobs.filter(
    (job: any) =>
      selectedCompany === 'All Companies' || job.company === selectedCompany
  );
  return (
    <div className='px-4'>
      <h2>
        Applied Jobs{' '}
        {appliedJobs.length > 0 ? <span>({appliedJobs.length})</span> : ''}
      </h2>
      <SearchAndSort
        setSortOrder={setSortOrder}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
      />
      <label htmlFor='sort-by'>Sort by:</label>
      <select
        title='Sort by'
        name='sort-by'
        id='sort-by'
        aria-label='Sort by'
        className='w-full rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
      >
        {companyOptions}
      </select>
      <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
        {filteredByCompany.map((job, index) => (
          <li key={index} className='job-posting'>
            <SinglePosting job={job} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppliedJobsComponent;
