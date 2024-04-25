import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar/Navbar';
import { NAVBAR_LINKS } from './constants/navbarLinks';

function App() {
  return (
    <div className='overflow-auto h-screen flex flex-col'>
      <Navbar navbarLinks={NAVBAR_LINKS} />
      <main className='w-full flex flex-col items-center justify-start gap-4 pt-2'>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
