import { format } from 'date-fns';

// Single posting component (table row)
const SinglePostingRow: React.FC<{
  job: any;
  onRowClick: () => void;
  onToggleApply: (e: React.MouseEvent) => void;
}> = ({ job, onRowClick, onToggleApply }) => (
  <tr
    onClick={onRowClick}
    className={`cursor-pointer ${
      job?.applied ? 'bg-green-200' : 'hover:bg-gray-100'
    }`}
  >
    <td className='p-2'>{job.title}</td>
    <td className='p-2'>{format(new Date(job.updated_at), 'MM/dd/yyyy')}</td>
    <td className='p-2'>{job.location.name}</td>{' '}
    <td className='p-2'>
      <a
        href={job.absolute_url}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-500 underline'
      >
        Link
      </a>
    </td>
    <td className='p-2'>
      <label className='flex items-center space-x-2'>
        <input
          type='checkbox'
          checked={job.applied}
          onChange={(e) => {
            e.stopPropagation();
            onToggleApply(job.id);
          }}
          className='form-checkbox h-5 w-5 text-blue-600'
        />
        <span>{job.applied ? '' : 'Applied'}</span>
      </label>
    </td>
  </tr>
);

export default SinglePostingRow;
