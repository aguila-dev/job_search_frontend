import he from 'he';
interface SelectedJobModalProps {
  selectedJob: any;
  setSelectedJob: any;
  url: string;
  setUrl: any;
}
const SelectedJobModal = ({
  selectedJob,
  setSelectedJob,
  url,
  setUrl,
}: SelectedJobModalProps) => {
  console.log({ selectedJob });
  const handleNavigationClick = () => {
    setSelectedJob(null);
    setUrl('');
  };
  return (
    <div className='fixed inset-0 z-50 flex justify-end'>
      <div className='overlay fixed inset-0 bg-black opacity-50'></div>
      <div className='relative w-5/6 md:w-2/3 h-full bg-white shadow-lg p-4 overflow-y-auto'>
        <button
          type='button'
          onClick={() => setSelectedJob(null)}
          className='fixed top-6 right-6 p-2 w-12 h-12 bg-red-500 text-white rounded-full opacity-50 hover:opacity-90'
          aria-label='Close'
        >
          &times;
        </button>
        <div
          className='job-details-content prose'
          dangerouslySetInnerHTML={{
            __html: he.decode(
              selectedJob && selectedJob.content
                ? selectedJob.content
                : selectedJob.jobPostingInfo
                ? selectedJob.jobPostingInfo?.jobDescription
                : 'No content found'
            ),
          }}
        ></div>
        <button
          type='button'
          onClick={() => setSelectedJob(null)}
          className='mt-4 p-2 bg-red-500 text-white rounded-lg'
        >
          Close
        </button>
        <a
          id='selectedJob-apply'
          type='button'
          href={url}
          target='_blank'
          onClick={handleNavigationClick}
          className='mt-4 ml-4 p-2 bg-blue-500 text-white rounded-lg hover:opacity-75 hover:text-black transition-all duration-300 ease-in-out'
        >
          Apply
        </a>
      </div>
    </div>
  );
};

export default SelectedJobModal;
