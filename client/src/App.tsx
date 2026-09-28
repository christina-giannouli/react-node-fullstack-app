import './App.css';
import { Form } from '@/components/Form.tsx';

function App() {
  return (
    <div className="container">
      <div className="flex h-screen flex-col justify-center">
        <div className="mx-auto w-full sm:max-w-md">
          <Form />
        </div>
      </div>
    </div>
  );
}

export default App;
