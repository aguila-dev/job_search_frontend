import AppRoutes from './AppRoutes';
import Navbar from './components/Navbar/Navbar';
import { NAVBAR_LINKS } from './constants/navbarLinks';

function App() {
  return (
    <div className='overflow-auto max-h-screen flex flex-col'>
      <Navbar navbarLinks={NAVBAR_LINKS} />
      <main className='w-full flex flex-col items-center justify-center gap-4 py-2 flex-1'>
        <AppRoutes />
      </main>
      <footer className='w-full text-center bottom-0 h-24 bg-zinc-500 text-slate-50 py-4'>
        footer
      </footer>
    </div>
  );
}

export default App;
