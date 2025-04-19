import { Homescreen } from './components/templates/Homescreen';
import './assets/styles/global.css';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Homescreen />
    </ThemeProvider>
  );
}

export default App;