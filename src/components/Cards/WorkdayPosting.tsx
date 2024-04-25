const WorkdayPosting = ({ job, baseUrl, appliedJobs, extractJobId }: any) => {
  const isApplied = appliedJobs[extractJobId(job)];

  return (
    <div
      className={`border-2 border-black rounded-xl text-center flex flex-col items-center justify-evenly p-4 flex-1 ${
        isApplied ? 'bg-green-200' : 'bg-slate-200 shadow-md'
      } hover:shadow-lg transition-shadow duration-200`}
    >
      <h3 className='font-semibold text-base bg-slate-300'>
        {job?.title ? job.title : 'title here'}
      </h3>
      <p>{job.locationsText ? job.locationsText : ''}</p>
      <p>{job.postedOnDate ? job.postedOnDate : job.postedOn}</p>
      <a
        href={`${baseUrl}${job.externalPath}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        Apply Here
      </a>
      {job?.bulletFields.length &&
        job.bulletFields.map((field: any, index: number) => (
          <p key={index} className='text-sm'>
            {field}
          </p>
        ))}
    </div>
  );
};

export default WorkdayPosting;
