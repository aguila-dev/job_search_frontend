import { format } from 'date-fns';

// Single posting component (table row)
const SinglePostingRow: React.FC<{
  job: any;
  onRowClick?: () => void;
  onToggleApply: (id: number) => void;
  baseUrl?: string;
  workday?: boolean;
}> = ({ job, onRowClick, onToggleApply, baseUrl, workday }) => {
  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onToggleApply(job.id);
  };
  console.log('job', job);
  return (
    <tr
      onClick={onRowClick}
      className={`cursor-pointer ${
        job?.applied ? 'bg-green-200' : 'hover:bg-gray-100'
      }`}
    >
      {job?.company ? (
        <td className='p-2 border-[1px] border-solid border-[#ddd]'>
          {job.company}
        </td>
      ) : null}
      <td className='p-2 border-[1px] border-solid border-[#ddd]'>
        {job.title}
      </td>
      <td className='p-2 border-[1px] border-solid border-[#ddd]'>
        {workday && job.postedOnDate
          ? job.postedOnDate
          : format(new Date(job.updated_at), 'MM/dd/yyyy')}
      </td>
      <td className='p-2 border-[1px] border-solid border-[#ddd]'>
        {workday && job.locationsText ? job.locationsText : job.location.name}
      </td>
      <td className='p-2 border-[1px] border-solid border-[#ddd]'>
        <a
          href={workday ? `${baseUrl}${job.externalPath}` : job.absolute_url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-500 underline'
        >
          Link
        </a>
      </td>
      <td className='p-2 border-[1px] border-solid border-[#ddd]'>
        <label className='flex items-center space-x-2' />
        <input
          type='checkbox'
          title='Applied'
          checked={job.applied}
          onClick={handleCheckboxClick}
          className='form-checkbox h-5 w-5 text-blue-600'
          readOnly // might need another solution
        />
      </td>
    </tr>
  );
};

export default SinglePostingRow;
