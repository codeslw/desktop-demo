import { makeStyles, shorthands } from '@fluentui/react-components';
import { memo } from 'react';

const useStyles = makeStyles({
  icon: {
    width: '30px',
    height: '30px',
    objectFit: 'contain'
  }
});

interface IconProps {
  src: string;
  alt: string;
  size?: string;
}

export const Icon = memo(({ src, alt, size = '30px' }: IconProps) => {
  const styles = useStyles();
  return (
    <img 
      src={src} 
      alt={alt} 
      className={styles.icon} 
      style={{ width: size, height: size }} 
    />
  );
});