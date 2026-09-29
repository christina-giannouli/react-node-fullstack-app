import './App.css';
import { Form } from '@/components/Form.tsx';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="container">
      <div className="flex h-screen flex-col justify-center">
        <div className="mx-auto w-full sm:max-w-md">
          <Form />
          <Toaster
            position="top-center"
            duration={38000}
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
