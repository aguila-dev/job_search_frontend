// Search and sort component
const SearchAndSort: React.FC<{
  setSortOrder: (sortOrder: string) => void;
  setSearchQuery: (searchQuery: string) => void;
  searchQuery: string;
}> = ({ setSortOrder, setSearchQuery, searchQuery }) => (
  <div className='flex flex-col sm:flex-row justify-between items-center py-2'>
    <input
      type='text'
      placeholder='Search jobs...'
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className='min-h-8 bg-slate-100 w-full sm:w-1/2 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
    />
    <select
      title='Sort by'
      onChange={(e) => setSortOrder(e.target.value)}
      className='ml-0 sm:ml-4 mt-2 sm:mt-0 p-2 border border-gray-300 rounded-lg'
    >
      <option value=''>Sort by</option>
      <option value='newest'>Newest</option>
      <option value='oldest'>Oldest</option>
    </select>
  </div>
);

export default SearchAndSort;
