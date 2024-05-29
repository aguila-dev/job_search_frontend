import Navbar from '../components/Navbar/Navbar';
import { NAVBAR_LINKS } from '../constants/navbarLinks';
import { LayoutProps } from '../interface/ILayout';

/**
 * ProtectedLayout.tsx file for handling protected routes
 * and logged in user routes
 */

const ProtectedLayout = ({ children }: LayoutProps) => {
  return (
    <div className='h-screen flex flex-col md:flex-row'>
      <Navbar navbarLinks={NAVBAR_LINKS} />
      <main className='w-full flex flex-col gap-4 p-4 flex-1'>{children}</main>
    </div>
  );
};

export default ProtectedLayout;
