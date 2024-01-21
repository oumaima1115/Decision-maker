import * as React from 'react';
import { createRoot } from 'react-dom/client';
import InputData from './Pages/InputData';
import '../src/assets/style.css';

async function addSticky() {
  const stickyNote = await miro.board.createStickyNote({
    content: 'Hello, World!',
  });

  await miro.board.viewport.zoomTo(stickyNote);
}

const App = () => {
  React.useEffect(() => {
    addSticky();
  }, []);

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
