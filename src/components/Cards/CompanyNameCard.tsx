import { useState } from 'react';
import DEFAULT_LOGO from '../../assets/image.png';

const CompanyNameCard = ({ company, onClick }: any) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  return (
    <div
      onClick={onClick}
      className='flex items-center justify-between p-2 bg-white shadow-md rounded-lg cursor-pointer hover:bg-gray-100 text-sm'
    >
      <img
        src={DEFAULT_LOGO}
        alt={company.title}
        className='w-6 h-6 rounded-full'
      />

      <div className='text-blue-500'>{company.name}</div>
      <span
        onClick={handleFavoriteClick}
        className='p-2 self-center focus:outline-none hover:text-red-500'
        aria-label='Favorite'
      >
        {isFavorite ? '❤️' : '🤍'}
      </span>
    </div>
  );
};

export default CompanyNameCard;
