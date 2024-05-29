import { LayoutProps } from '../interface/ILayout';

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <main className='h-dvh w-dvw'>
      <div className='h-full w-full flex items-center justify-center tan'>
        <div className='w-full h-full flex items-center justify-evenly'>
          <div className='hidden sm:flex flex-col flex-1 items-center justify-evenly dark-green h-full'>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
              Welcome to the Auth Layout
            </h2>
            <p>Helping thousands of applicants just like you</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
