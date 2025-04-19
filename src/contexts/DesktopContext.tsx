import { createContext, useContext, useState, useCallback } from 'react';
import { DesktopState, DesktopIcon } from '../types';
import { INITIAL_DESKTOP_STATE } from '../utils/constants';

interface DesktopContextType {
  desktopState: DesktopState;
  updateIconPosition: (id: string, x: number, y: number) => void;
  deleteIcon: (id: string) => void;
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export const DesktopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [desktopState, setDesktopState] = useState<DesktopState>(INITIAL_DESKTOP_STATE);

  const updateIconPosition = useCallback((id: string, x: number, y: number) => {
    setDesktopState(prev => ({
      ...prev,
      icons: prev.icons.map(icon =>
        icon.id === id ? { ...icon, position: { x, y } } : icon
      )
    }));
  }, []);

  const deleteIcon = useCallback((id: string) => {
    setDesktopState(prev => ({
      ...prev,
      icons: prev.icons.filter(icon => icon.id !== id)
    }));
  }, []);

  return (
    <DesktopContext.Provider value={{ desktopState, updateIconPosition, deleteIcon }}>
      {children && children}
    </DesktopContext.Provider>
  );
};

export const useDesktopContext = () => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktopContext must be used within a DesktopProvider');
  }
  return context;
};