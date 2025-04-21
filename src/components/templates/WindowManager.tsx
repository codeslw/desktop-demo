import { memo } from 'react';
import { useWindowContext } from '../../contexts/WindowContext';
import { ThisPC } from '../windows/ThisPC';
import { FolderContent } from '../windows/FolderContent';
import { Reports } from '../windows/Reports';

export const WindowManager = memo(() => {
  const { windows } = useWindowContext();
  
  return (
    <>
      {/* Render ThisPC window separately */}
      <ThisPC />
      
      {/* Render Reports window when opened */}
      {windows.find(window => window.id === 'reports' && window.isOpen) && <Reports />}
      
      {/* Render all dynamically created folder windows */}
      {windows.map(window => {
        if (window.type === 'folder' && window.id !== 'thispc') {
          return <FolderContent key={window.id} id={window.id} />;
        }
        return null;
      })}
    </>
  );
}); 