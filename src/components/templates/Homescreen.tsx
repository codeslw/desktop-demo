import { Desktop } from '../organisms/Desktop';
import { Taskbar } from '../organisms/Taskbar';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DesktopProvider } from '../../contexts/DesktopContext';
import { WindowProvider } from '../../contexts/WindowContext';
import { memo, useEffect } from 'react';
import { WindowManager } from './WindowManager';
import { useNavigate } from 'react-router-dom';

export const Homescreen = memo(() => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, []);
  
  return (
      <DesktopProvider>
        <WindowProvider>
          <Desktop />
          <WindowManager />
          <Taskbar />
        </WindowProvider>
      </DesktopProvider>
  );
});