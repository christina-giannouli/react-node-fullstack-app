import './App.css';
import { NewProperty } from '@/pages/NewProperty.tsx';
import { Properties } from '@/pages/Properties.tsx';
import { Toaster } from 'sonner';
import { Route, Routes } from 'react-router';

function App() {
  return (
    <div className="container">
      <div className="flex min-h-screen flex-col justify-center py-8">
        <div className="mx-auto w-full px-5 sm:max-w-md lg:px-0">
          <Routes>
            <Route path="/" element={<NewProperty />} />
            <Route path="/properties" element={<Properties />} />
          </Routes>
          <Toaster
            position="top-center"
            duration={6000}
            visibleToasts={3}
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast: 'pr-10! [--toast-close-button-start:auto] [--toast-close-button-end:2px]',
                closeButton: 'top-4! border-0! bg-transparent!',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
