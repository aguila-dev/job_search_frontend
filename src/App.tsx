import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar/Navbar';
import { NAVBAR_LINKS } from './constants/navbarLinks';

function App() {
  return (
    <div className='overflow-auto min-h-screen flex flex-col md:flex-row'>
      <Navbar navbarLinks={NAVBAR_LINKS} />
      <main className='w-full flex flex-col gap-4 p-4 flex-1'>
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
