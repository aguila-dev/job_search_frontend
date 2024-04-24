const SearchAndSort = ({ setSortOrder, setSearchQuery, searchQuery }: any) => {
  return (
    <div className='flex flex-col w-full items-center gap-4'>
      <div>
        <button type='button' onClick={() => setSortOrder('newest')}>
          Sort by Newest
        </button>
        <button type='button' onClick={() => setSortOrder('oldest')}>
          Sort by Oldest
        </button>
        <button type='button' onClick={() => setSortOrder('')}>
          Reset Sort
        </button>
      </div>
      <div className='w-full text-center pb-2'>
        <input
          type='text'
          placeholder='Search jobs...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='min-h-8 bg-slate-100 w-full rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50'
        />
      </div>
    </div>
  );
};

export default SearchAndSort;
