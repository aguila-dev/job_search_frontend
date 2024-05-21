import { useState } from 'react';

// Search and sort component
const SearchAndSort: React.FC<{
  onSubmitSearch: (searchQuery: string) => void;
}> = ({ onSubmitSearch }) => {
  const [inputQuery, setInputQuery] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSearch(inputQuery);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col sm:flex-row justify-between items-center py-2'
    >
      <input
        type='text'
        placeholder='Search jobs...'
        value={inputQuery}
        onChange={(e) => setInputQuery(e.target.value)}
        className='min-h-8 bg-slate-100 w-full sm:w-1/2 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
      />
      <button
        type='submit'
        className='bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 sm:mt-0'
      >
        Search
      </button>
      {/* <select
      title='Sort by'
      onChange={(e) => setSortOrder(e.target.value)}
      className='ml-0 sm:ml-4 mt-2 sm:mt-0 p-2 border border-gray-300 rounded-lg'
    >
      <option value=''>Sort by</option>
      <option value='newest'>Newest</option>
      <option value='oldest'>Oldest</option>
    </select> */}
    </form>
  );
};

export default SearchAndSort;
