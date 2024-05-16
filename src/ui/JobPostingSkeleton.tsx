const JobPostingSkeleton = () => {
  return (
    <div className=' rounded-xl min-w-[205px] max-w-[430px] text-center flex flex-col items-center justify-center p-4 bg-slate-200 animate-pulse'>
      <div className='h-6 w-3/4 bg-slate-300 rounded-md mb-2'></div>
      <div className='h-8 w-3/4 bg-slate-300 rounded-md mb-2'></div>
      <div className='h-6 w-1/2 bg-slate-300 rounded-md mb-2'></div>
      <div className='h-6 w-1/2 bg-slate-300 rounded-md mb-2'></div>
      <div className='h-6 w-1/4 bg-slate-300 rounded-md'></div>
    </div>
  );
};

export const SingleJobPostingSkeletonRow = ({ cols }: { cols: number }) => (
  <tr className='w-full animate-pulse'>
    {Array.from({ length: cols }, (_, index) => (
      <td key={index} className='p-4 bg-slate-200'>
        <div className='h-4 bg-slate-300 rounded mb-2 w-3/4'></div>
      </td>
    ))}
  </tr>
);

export default JobPostingSkeleton;
