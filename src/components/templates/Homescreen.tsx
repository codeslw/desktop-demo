import { Desktop } from '../organisms/Desktop';
import { Taskbar } from '../organisms/Taskbar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DesktopProvider } from '../../contexts/DesktopContext';
import { memo } from 'react';

export const Homescreen = memo(() => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DesktopProvider>
        <Desktop />
        <Taskbar />
        </DesktopProvider>
    </DndProvider>
  );
});