import { makeStyles, shorthands } from '@fluentui/react-components';
import { memo } from 'react';
import { FolderItem } from '../windows/FolderWindow';

interface FileItemProps {
  item: FolderItem;
  isSelected: boolean;
  onClick: (event: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
}

const useStyles = makeStyles({
  folderItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius('8px'),
    ...shorthands.border('1px', 'solid', 'transparent'),
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--window-item-hover-bg)',
      ...shorthands.borderColor('var(--window-border)'),
    },
    transition: 'all 0.15s ease',
    userSelect: 'none',
  },
  selectedItem: {
    backgroundColor: 'var(--icon-selected-bg)',
    ...shorthands.borderColor('var(--window-accent)'),
    '&:hover': {
      backgroundColor: 'var(--icon-selected-hover-bg)',
    },
  },
  itemIcon: {
    width: '32px',
    height: '32px',
    ...shorthands.margin('0', '12px', '0', '0'),
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '500',
    ...shorthands.margin('0', '0', '4px', '0'),
  },
  itemInfo: {
    fontSize: '12px',
    color: 'var(--text-color-secondary)',
  }
});

export const FileItem = memo(({ 
  item, 
  isSelected, 
  onClick, 
  onDoubleClick, 
  onContextMenu 
}: FileItemProps) => {
  const styles = useStyles();
  
  return (
    <div 
      className={`${styles.folderItem} ${isSelected ? styles.selectedItem : ''}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <img src={item.icon} alt={item.name} className={styles.itemIcon} />
      <div className={styles.itemDetails}>
        <div className={styles.itemName}>{item.name}</div>
        <div className={styles.itemInfo}>
          {item.type === 'drive' && item.size}
          {item.type === 'folder' && (item.location || 'Folder')}
          {item.type === 'file' && (item.dateModified || 'File')}
        </div>
      </div>
    </div>
  );
}); 