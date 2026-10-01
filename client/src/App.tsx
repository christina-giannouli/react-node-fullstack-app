import './App.css';
import { NewProperty } from '@/pages/NewProperty.tsx';
import { Properties } from '@/pages/Properties.tsx';
import { Toaster } from 'sonner';
import { Route, Routes } from 'react-router';

function App() {
  return (
    <div className="container mx-auto">
      <div className="flex min-h-screen flex-col justify-center py-8">
        <div className="w-full px-5 lg:px-0">
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
                // Dark green outlined button, readable on the light green success toast.
                // `!` beats Sonner's own styles; border-solid! is needed because Sonner sets `border: none`.
                actionButton:
                  'h-7! rounded-full! border! border-solid! border-green-700! bg-transparent! px-3! text-green-700! transition-colors hover:bg-green-700/10!',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
