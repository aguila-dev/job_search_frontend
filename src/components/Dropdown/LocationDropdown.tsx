// LocationDropdown.js

import { useState } from 'react';

const LocationDropdown = ({
  locations,
  selectedLocations,
  onLocationChange,
}: LocationDropdownProps) => {
  const [activeLocation, setActiveLocation] = useState<boolean>(false);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    onLocationChange(event.target.value, event.target.checked, type);
  };

  return (
    <div className='relative text-center z-50'>
      <button type='button' onClick={() => setActiveLocation((prev) => !prev)}>
        Locations
      </button>
      <div
        id='dropdownLocationsMenu'
        className={`absolute z-50 bg-white border border-gray-200 rounded shadow-lg mt-1 w-64 max-h-96 overflow-y-auto ${
          activeLocation ? 'flex flex-col' : 'hidden'
        }`}
      >
        {locations.map((location: any) => (
          <div
            key={location.id}
            className='flex items-center p-2 hover:bg-gray-100'
          >
            <input
              type='checkbox'
              id={location.id}
              value={location.id}
              className='mr-2'
              onChange={(e) => handleCheckboxChange(e, 'locations')}
              checked={selectedLocations.includes(location.id)}
            />
            <label htmlFor={location.id} className='flex-grow cursor-pointer'>
              {location.descriptor}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationDropdown;
