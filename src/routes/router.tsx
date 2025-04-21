import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Homescreen } from '../components/templates/Homescreen';
import { Settings } from '../components/windows/Settings';
import { ThisPC } from '../components/windows/ThisPC';
import { Reports } from '../components/windows/Reports';
import { FolderWindow } from '../components/windows/FolderWindow';

// Create and export the router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Homescreen />,
    children: [
      { 
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'this-pc',
        element: <ThisPC />
      },
      {
        path: 'reports',
        element: <Reports />
      },
      {
        path: 'folder/:folderId',
        //@ts-ignore
        element: <FolderWindow />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
]); 