import { makeStyles, shorthands } from '@fluentui/react-components';
import { memo } from 'react';

interface PathBarProps {
  path: string;
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
  },
  pathSeparator: {
    ...shorthands.margin('0', '4px'),
    color: 'var(--text-color-secondary)',
  }
});

export const PathBar = memo(({ path }: PathBarProps) => {
  const styles = useStyles();
  
  // Split path into parts to display with separators
  const pathParts = path.split('/').filter(part => part);
  
  return (
    <div className={styles.addressBar}>
      <div className={styles.addressBarPath}>
        <img 
          src="/src/assets/icons/folders.svg" 
          alt="Folder" 
          className={styles.folderIcon} 
        />
        
        {pathParts.length === 0 && (
          <span>This PC</span>
        )}
        
        {pathParts.map((part, index) => (
          <span key={index} className={styles.pathPart}>
            {index > 0 && <span className={styles.pathSeparator}>›</span>}
            {part}
          </span>
        ))}
      </div>
    </div>
  );
}); 