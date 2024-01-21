import * as React from 'react';
import { createRoot } from 'react-dom/client';
import InputData from './Pages/InputData';
import '../src/assets/style.css';


const App = () => {

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <InputData/>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
