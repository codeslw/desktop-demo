import { Homescreen } from './components/templates/Homescreen';
import './assets/styles/global.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';

function App() {



  return (
    <BrowserRouter>
      <ThemeProvider>
        <Homescreen />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;