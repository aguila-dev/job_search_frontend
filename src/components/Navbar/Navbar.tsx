import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavItem from '../Button/NavItem';
import { MagnifyingGlassArrowLogo, MagnifyingGlassLogo } from '../Logo/AppLogo';

type NavbarLink = {
  name: string;
  path: string;
  active?: boolean;
};
interface NavbarProps {
  navbarLinks: NavbarLink[];
}

const Navbar = ({ navbarLinks }: NavbarProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    // Optionally toggle body scroll lock
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const handleClickLink = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className='bg-zinc-500 text-slate-50 font-semibold p-4 z-50'>
      {/* Hamburger Icon */}
      <div className='md:hidden flex justify-end max-h-16'>
        <button
          type='button'
          onClick={handleMenuToggle}
          className='text-3xl z-50 text-black focus:outline-none flex items-center justify-center w-12 h-12'
        >
          {isMenuOpen ? <span>&times;</span> : <span>&#9776;</span>}
        </button>
      </div>
      {/* Fullscreen Menu for Mobile */}
      <div
        className={`fixed inset-0 bg-zinc-700 flex flex-col items-center justify-center transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } z-40`}
      >
        {navbarLinks.map(
          (link) =>
            link.active && (
              <p
                key={link.name}
                className='text-xl py-4 cursor-pointer hover:opacity-75'
                onClick={() => handleClickLink(link.path)}
              >
                {link.name}
              </p>
            )
        )}
      </div>

      {/* Desktop Menu */}
      <div className='hidden md:flex md:flex-col md:items-center md:justify-center md:gap-4'>
        {navbarLinks.map(
          (link) =>
            link.active && (
              <NavItem
                key={link.name}
                link={link}
                handleClickLink={handleClickLink}
              />
            )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
