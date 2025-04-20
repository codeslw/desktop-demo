import { memo } from 'react';
import { useWindowContext } from '../../contexts/WindowContext';
import { ThisPC } from '../windows/ThisPC';
import { FolderContent } from '../windows/FolderContent';

export const WindowManager = memo(() => {
  const { windows } = useWindowContext();
  
  return (
    <>
      {/* Render ThisPC window separately */}
      <ThisPC />
      
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