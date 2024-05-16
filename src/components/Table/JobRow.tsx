import { useState } from 'react';

// JobRow Component
const JobRow: React.FC<JobRowProps> = ({
  job,
  handleAppliedDateChange,
  handleStatusChange,
  handleJobConsideration,
}) => {
  const [consideringStatus, setConsideringStatus] = useState<boolean>(
    job.considering ?? true
  );
  const [status, setStatus] = useState<string>(job.status || 'active');
  const handleStatusChangeLocal = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    handleStatusChange(job.company, job.id, newStatus);
  };

  const handleConsiderationChange = () => {
    const newConsideringStatus = !consideringStatus;
    setConsideringStatus(newConsideringStatus);
    handleJobConsideration(job.company, job.id, newConsideringStatus);
  };

  return (
    <tr>
      <td className='border p-2'>{job.company}</td>
      <td className='border p-2'>
        <a
          href={job.absolute_url || job.externalPath}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 underline'
        >
          {job.title}
        </a>
      </td>
      <td className='border p-2'>{job.location?.name || job.locationsText}</td>
      <td className='border p-2'>
        <input
          title='Applied Date'
          type='date'
          value={job.appliedDate || ''}
          onChange={(e) =>
            handleAppliedDateChange(job.company, job.id, e.target.value)
          }
          className='w-full px-2 py-1 border rounded'
        />
      </td>
      <td className='border p-2'>
        <input
          type='text'
          placeholder='Add notes...'
          className='w-full px-2 py-1 border rounded'
        />
      </td>
      <td className='border p-2'>
        <select
          title='Application Status'
          className='w-full px-2 py-1 border rounded'
          onChange={handleStatusChangeLocal}
          value={status}
        >
          <option value='active'>Active</option>
          <option value='pending'>Pending</option>
          <option value='rejected'>Rejected</option>
          <option value='interviewing'>Interviewing</option>
        </select>
      </td>
      <td className='border p-2 text-center'>
        <input
          title='No Longer Considering'
          type='checkbox'
          checked={!consideringStatus}
          onChange={handleConsiderationChange}
          className='transform scale-125'
        />
      </td>
    </tr>
  );
};

export default JobRow;
