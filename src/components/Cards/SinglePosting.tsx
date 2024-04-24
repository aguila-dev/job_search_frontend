const SinglePosting = ({ job }: any) => {
  // Formatting the updated_at date for better readability
  const formattedDate = new Date(job?.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const pathName = window.location.pathname;

  return (
    <div
      className={`border-2 border-black rounded-xl text-center flex flex-col items-center justify-evenly p-4 flex-1 ${
        job?.applied ? 'bg-green-200' : 'bg-slate-200'
      }`}
    >
      <p className='text-sm'>id: {job?.id}</p>
      <h3 className='font-semibold text-base bg-slate-300'>
        {job?.title ? job.title : 'title here'}
      </h3>
      <div className='text-xs'>
        <p>Last Updated: </p>
        <p>{formattedDate ? formattedDate : 'date here'}</p>
      </div>
      <div className='text-xs'>
        <p>Location: </p>
        <p>{job?.location?.name ? job.location.name : 'location...'}</p>
      </div>
      {pathName === '/applied-jobs' ? (
        <p className='font-bold'>{job?.company}</p>
      ) : (
        <a
          href={job?.absolute_url ? job.absolute_url : 'url here'}
          target='_blank'
          rel='noopener noreferrer'
        >
          Apply Here
        </a>
      )}
    </div>
  );
};

export default SinglePosting;
