import { Desktop } from '../organisms/Desktop';
import { Taskbar } from '../organisms/Taskbar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DesktopProvider } from '../../contexts/DesktopContext';
import { WindowProvider } from '../../contexts/WindowContext';
import { memo } from 'react';
import { WindowManager } from './WindowManager';

export const Homescreen = memo(() => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DesktopProvider>
        <WindowProvider>
          <Desktop />
          <WindowManager />
          <Taskbar />
        </WindowProvider>
      </DesktopProvider>
    </DndProvider>
  );
});