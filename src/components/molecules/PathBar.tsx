import { makeStyles, shorthands } from '@fluentui/react-components';
import { memo } from 'react';
import { Home24Regular } from '@fluentui/react-icons';

interface PathBarProps {
  path: string;
  onNavigate?: (path: string) => void;
}

const useStyles = makeStyles({
  addressBar: {
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    backgroundColor: 'var(--window-addressbar-bg)',
    ...shorthands.borderBottom('1px', 'solid', 'var(--window-border)'),
    ...shorthands.padding('0', '16px'),
  },
  addressBarPath: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    flexGrow: 1,
    ...shorthands.padding('8px', '10px'),
    backgroundColor: 'var(--window-bg)',
    ...shorthands.borderRadius('6px'),
    ...shorthands.border('1px', 'solid', 'var(--window-border)'),
    transition: 'border-color 0.15s ease',
    '&:hover': {
      ...shorthands.borderColor('var(--window-accent)'),
    },
  },
  folderIcon: {
    width: '18px',
    height: '18px',
    ...shorthands.margin('0', '8px', '0', '0'),
  },
  pathPart: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    cursor: 'pointer',
    ...shorthands.padding('2px', '6px'),
    ...shorthands.borderRadius('4px'),
    '&:hover': {
      backgroundColor: 'var(--icon-hover-bg)',
    },
  },
  pathSeparator: {
    ...shorthands.margin('0', '4px'),
    color: 'var(--text-color-secondary)',
  },
  homeIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-color)',
  }
});

export const PathBar = memo(({ path, onNavigate }: PathBarProps) => {
  const styles = useStyles();
  
  // Split path into parts to display with separators
  const pathParts = path.split('/').filter(part => part);
  
  // Function to handle breadcrumb navigation
  const handlePartClick = (index: number) => {
    if (!onNavigate) return;
    
    if (index === -1) {
      // Home/root navigation
      onNavigate('This PC');
      return;
    }
    
    // Navigate to the path up to the clicked part
    const targetPath = pathParts.slice(0, index + 1).join('/');
    onNavigate(targetPath);
  };
  
  return (
    <div className={styles.addressBar}>
      <div className={styles.addressBarPath}>
        {/* Home icon for root */}
        <div 
          className={styles.pathPart} 
          onClick={() => handlePartClick(-1)}
          title="This PC"
        >
          <span className={styles.homeIcon}>
            <Home24Regular />
          </span>
        </div>
        
        {pathParts.length === 0 ? (
          <span className={styles.pathSeparator}>This PC</span>
        ) : (
          pathParts.map((part, index) => (
            <span key={index} className={styles.pathPart} onClick={() => handlePartClick(index)}>
              {index > 0 && <span className={styles.pathSeparator}>›</span>}
              {part}
            </span>
          ))
        )}
      </div>
    </div>
  );
}); 