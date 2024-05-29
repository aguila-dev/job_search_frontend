import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import NavItem from '../Button/NavItem';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { logout, logoutCurrentUser } from '../../redux/slices/authSlice';

type NavbarLink = {
  name: string;
  path: string;
  active?: boolean;
  requiresAuth?: boolean;
};
interface NavbarProps {
  navbarLinks: NavbarLink[];
}

const Navbar = ({ navbarLinks }: NavbarProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data } = useAppSelector((state) => state.auth);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    // Optionally toggle body scroll lock
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const handleClickLink = (path: string) => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
    navigate(path);
  };

  const handleLogout = async () => {
    // Call logoutCurrentUser action
    console.log('Logout');
    await dispatch(logout());
  };

  return (
    <nav className='dark-green text-slate-50 font-semibold p-4 z-50 md:w-64'>
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
        {navbarLinks
          .filter((link) => (data?.auth ? link.active : !link.requiresAuth))
          .map(
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
      <div className='hidden md:flex md:flex-col justify-between md:gap-4 h-full flex-1'>
        <div className='flex flex-col gap-4'>
          {navbarLinks
            .filter((link) => (data?.auth ? link.active : !link.requiresAuth))
            .map(
              (link) =>
                link.active && (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `hover:cursor-pointer px-4 py-2 text-black w-full rounded-lg text-center transition-all duration-300 ease-in-out ${
                        isActive
                          ? 'bg-slate-400 bg-opacity-90'
                          : 'hover:bg-slate-300 hover:bg-opacity-65'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                )
            )}
        </div>
        <button
          type='button'
          onClick={handleLogout}
          // to='/auth'
          className='hover:cursor-pointer px-4 py-2 text-black w-full rounded-lg text-center transition-all duration-300 ease-in-out hover:bg-slate-300 hover:bg-opacity-65'
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
