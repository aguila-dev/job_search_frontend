import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar/Navbar';
import { NAVBAR_LINKS } from './constants/navbarLinks';

function App() {
  return (
    <>
      <Navbar navbarLinks={NAVBAR_LINKS} />
      <main className='w-full min-h-screen flex flex-col items-center justify-start gap-4 pt-2 mt-20'>
        <AppRoutes />
      </main>
    </>
  );
}

export default App;
