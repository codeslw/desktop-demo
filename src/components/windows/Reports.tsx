import { makeStyles, shorthands, Input, Button, Tab, TabList, SelectTabEvent, SelectTabData, mergeClasses } from '@fluentui/react-components';
import { memo, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Window } from '../organisms/Window';
import { useTheme } from '../../contexts/ThemeContext';
import { useWindowContext } from '../../contexts/WindowContext';
import { 
  ArrowClockwise20Regular, 
  Filter20Regular, 
  Delete20Regular, 
  Add20Regular, 
  Money20Regular, 
  Receipt20Regular,
  PersonMoney20Regular,
  Calculator20Regular,
  ChartMultiple20Regular,
  DocumentPdf20Regular,
  ArrowDownload20Regular,
  Save20Regular,
  Search20Regular
} from '@fluentui/react-icons';

// AG Grid imports
// Import the base styles and our custom themes
// import 'ag-grid-community/styles/ag-grid.css';
// Import modules (AG Grid v33 requires explicit module imports)
import { AgGridReact } from 'ag-grid-react';
import {  ModuleRegistry, AllCommunityModule, ValidationModule, themeBalham, colorSchemeDark, colorSchemeLight} from 'ag-grid-community'; 

// Register the required modules
 ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);
//const modules = [ClientSideRowModelModule];

const useReportsStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'var(--window-content-bg)',
    color: 'var(--text-color)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    backgroundColor: 'var(--window-toolbar-bg)',
    borderBottom: '1px solid var(--window-border)',
  },
  tabs: {
    marginRight: '16px',
  },
  windows11Tabs: {
    marginRight: '16px',
    '& .fui-TabList': {
      backgroundColor: 'transparent',
      gap: '4px',
    },
    '& .fui-Tab': {
      fontSize: '13px',
      padding: '6px 16px',
      borderRadius: '4px',
      transition: 'all 0.15s ease',
      height: '36px',
      color: 'var(--text-color)',
      position: 'relative',
      '&:hover': {
        backgroundColor: 'var(--icon-hover-bg)',
      },
      '&:active': {
        backgroundColor: 'var(--icon-active-bg)',
        
      },
    },
    '& .fui-Tab__icon': {
      color: 'var(--text-color)',
      fontSize: '18px',
      marginRight: '8px',
    },
    '& .fui-Tab--selected': {
      backgroundColor: 'var(--icon-selected-bg)',
      color: 'var(--text-color)',
      fontWeight: '600',
      '&:hover': {
        backgroundColor: 'var(--icon-selected-hover-bg)',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '3px',
        backgroundColor: 'var(--tab-indicator-color, var(--window-accent))',
      },
      '& .fui-Tab__icon': {
        color: 'var(--tab-selected-icon-color, var(--window-accent))',
      },
    },
  },
  activeTab: {
    backgroundColor: 'var(--icon-selected-bg)',
  },
  searchContainer: {
    width: '300px',
    position: 'relative',
  },
  searchInput: {
    backgroundColor: 'var(--window-bg)',
    borderRadius: '4px',
    padding: '4px 8px',
    ...shorthands.border('1px', 'solid', 'var(--window-border)'),
    '&:focus-within': {
      ...shorthands.borderColor('var(--window-accent)'),
    },
  },
  activeSearch: {
    backgroundColor: 'var(--icon-selected-bg)',
    ...shorthands.borderColor('var(--window-accent)'),
  },
  searchIcon: {
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: 'var(--icon-hover-bg)',
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: 'var(--window-toolbar-bg)',
    borderBottom: '1px solid var(--window-border)',
    gap: '8px',
  },
  toolbarButton: {
    // Adding dedicated styling for toolbar buttons to avoid class merging conflicts
    minWidth: 'unset'
  },
  toolbarDivider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'var(--window-border)',
    margin: '0 8px',
  },
  gridContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'var(--window-content-bg)',
    position: 'relative',
  },
  grid: {
    width: '100%',
    height: '100%',
    fontSize: '13px',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 16px',
    backgroundColor: 'var(--window-toolbar-bg)',
    borderTop: '1px solid var(--window-border)',
    fontSize: '12px',
    color: 'var(--text-color-secondary)',
  },
  statusSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statusDivider: {
    width: '1px',
    height: '14px',
    backgroundColor: 'var(--window-border)',
    margin: '0 8px',
  },
  statusHighlight: {
    color: 'var(--window-accent)',
    fontWeight: '600',
  },
}); 


// Report types
type ReportType = 'legal' | 'individual' | 'entrepreneur';

// Toolbar component for Reports
const ReportsToolbar = memo(({ 
  onAddRow, 
  onDeleteSelected, 
  onRefresh, 
  onSave, 
  onExportPdf, 
  onExportExcel, 
  onCalculate, 
  onAnalytics, 
  onFilter 
}: { 
  onAddRow: () => void, 
  onDeleteSelected: () => void,
  onRefresh: () => void,
  onSave: () => void,
  onExportPdf: () => void,
  onExportExcel: () => void,
  onCalculate: () => void,
  onAnalytics: () => void,
  onFilter: () => void
}) => {
  const styles = useReportsStyles();
  
  return (
    <div className={styles.toolbar}>
      <Button icon={<Add20Regular />} appearance="subtle" onClick={onAddRow} className={styles.toolbarButton}>
        Add New
      </Button>
      <Button icon={<Delete20Regular />} appearance="subtle" onClick={onDeleteSelected} className={styles.toolbarButton}>
        Delete
      </Button>
      <div className={styles.toolbarDivider} />
      <Button icon={<Filter20Regular />} appearance="subtle" onClick={onFilter} className={styles.toolbarButton}>
        Filter
      </Button>
      <Button icon={<ArrowClockwise20Regular />} appearance="subtle" onClick={onRefresh} className={styles.toolbarButton}>
        Refresh
      </Button>
      <div className={styles.toolbarDivider} />
      <Button icon={<Save20Regular />} appearance="subtle" onClick={onSave} className={styles.toolbarButton}>
        Save
      </Button>
      <Button icon={<DocumentPdf20Regular />} appearance="subtle" onClick={onExportPdf} className={styles.toolbarButton}>
        Export PDF
      </Button>
      <Button icon={<ArrowDownload20Regular />} appearance="subtle" onClick={onExportExcel} className={styles.toolbarButton}>
        Export Excel
      </Button>
      <div className={styles.toolbarDivider} />
      <Button icon={<Calculator20Regular />} appearance="subtle" onClick={onCalculate} className={styles.toolbarButton}>
        Calculate
      </Button>
      <Button icon={<ChartMultiple20Regular />} appearance="subtle" onClick={onAnalytics} className={styles.toolbarButton}>
        Analytics
      </Button>
    </div>
  );
});

// Generate synthetic data for legal entities tax reports
const generateLegalEntityData = (count: number) => {
  const companies = ['Acme Corp', 'Globex Inc', 'Initech LLC', 'Stark Industries', 'Wayne Enterprises', 'Umbrella Corp', 'Cyberdyne Systems', 'Massive Dynamic'];
  const taxTypes = ['Income Tax', 'VAT', 'Property Tax', 'Corporate Tax', 'Payroll Tax'];
  const statuses = ['Paid', 'Overdue', 'Pending', 'Disputed', 'Exempt'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: 1000 + i,
    companyName: companies[Math.floor(Math.random() * companies.length)],
    taxId: `TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
    taxType: taxTypes[Math.floor(Math.random() * taxTypes.length)],
    amount: Math.round(Math.random() * 100000) / 100,
    dueDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    fine: Math.random() > 0.7 ? Math.round(Math.random() * 10000) / 100 : 0,
    lastPaymentDate: Math.random() > 0.5 ? new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] : '',
    hasFines: Math.random() > 0.7,
    callRecords: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
      date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      agent: `Agent ${Math.floor(Math.random() * 10) + 1}`,
      notes: `Call note ${j + 1} regarding tax payment`,
      duration: Math.floor(Math.random() * 30) + 1
    }))
  }));
};

// Generate data for individual tax reports
const generateIndividualData = (count: number) => {
  const names = ['John Smith', 'Jane Doe', 'Robert Johnson', 'Emily Davis', 'Michael Wilson', 'Sarah Brown', 'David Thompson', 'Lisa Garcia'];
  const taxTypes = ['Income Tax', 'Property Tax', 'Capital Gains Tax', 'Inheritance Tax'];
  const statuses = ['Paid', 'Overdue', 'Pending', 'Disputed', 'Exempt'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: 2000 + i,
    fullName: names[Math.floor(Math.random() * names.length)],
    socialSecurityNumber: `SSN-${Math.floor(100000000 + Math.random() * 900000000)}`,
    taxType: taxTypes[Math.floor(Math.random() * taxTypes.length)],
    amount: Math.round(Math.random() * 50000) / 100,
    dueDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    fine: Math.random() > 0.7 ? Math.round(Math.random() * 5000) / 100 : 0,
    hasFines: Math.random() > 0.7
  }));
};

// Generate data for entrepreneur tax reports
const generateEntrepreneurData = (count: number) => {
  const businesses = ['Craft Brewery', 'Tech Startup', 'Design Studio', 'Consulting Firm', 'Local Restaurant', 'Online Store', 'Fitness Center'];
  const owners = ['John Smith', 'Jane Doe', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'];
  const taxTypes = ['Income Tax', 'Sales Tax', 'Self-Employment Tax', 'Business Property Tax'];
  const statuses = ['Paid', 'Overdue', 'Pending', 'Disputed', 'Exempt'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: 3000 + i,
    businessName: businesses[Math.floor(Math.random() * businesses.length)],
    ownerName: owners[Math.floor(Math.random() * owners.length)],
    businessId: `BUS-${Math.floor(10000 + Math.random() * 90000)}`,
    taxType: taxTypes[Math.floor(Math.random() * taxTypes.length)],
    amount: Math.round(Math.random() * 75000) / 100,
    dueDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    fine: Math.random() > 0.7 ? Math.round(Math.random() * 7500) / 100 : 0,
    quarterlyFiling: Math.random() > 0.5,
    hasFines: Math.random() > 0.7
  }));
};

// const DetailCellRenderer = (props: any) => {
//   const { data } = props;
//   const callRecords = data.callRecords || [];
//   const { theme } = useTheme();
  
//   const styles = {
//     container: {
//       padding: '20px',
//       backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f8f8f8',
//       borderRadius: '4px',
//       margin: '10px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//     },
//     header: {
//       fontSize: '14px',
//       fontWeight: 'bold',
//       marginBottom: '10px',
//       color: theme === 'dark' ? '#ffffff' : '#333333'
//     },
//     row: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(4, 1fr)',
//       padding: '8px',
//       borderBottom: `1px solid ${theme === 'dark' ? '#333333' : '#e0e0e0'}`,
//       color: theme === 'dark' ? '#cccccc' : '#555555'
//     },
//     headerRow: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(4, 1fr)',
//       padding: '8px',
//       borderBottom: `1px solid ${theme === 'dark' ? '#444444' : '#cccccc'}`,
//       fontWeight: 'bold',
//       backgroundColor: theme === 'dark' ? '#2a2a2a' : '#eeeeee',
//       color: theme === 'dark' ? '#ffffff' : '#333333'
//     },
//     noRecords: {
//       padding: '15px',
//       textAlign: 'center' as const,
//       color: theme === 'dark' ? '#888888' : '#999999'
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>Contact History</div>
      
//       {callRecords.length > 0 ? (
//         <>
//           <div style={styles.headerRow}>
//             <div>Date</div>
//             <div>Agent</div>
//             <div>Notes</div>
//             <div>Duration (min)</div>
//           </div>
          
//           {callRecords.map((record: any, index: number) => (
//             <div key={index} style={styles.row}>
//               <div>{record.date}</div>
//               <div>{record.agent}</div>
//               <div>{record.notes}</div>
//               <div>{record.duration}</div>
//             </div>
//           ))}
//         </>
//       ) : (
//         <div style={styles.noRecords}>No contact history available</div>
//       )}
//     </div>
//   );
// };

// Main Reports component
export const Reports = memo(() => {
  const { theme } = useTheme();
  const { getWindowById } = useWindowContext();
  const styles = useReportsStyles();
  const gridRef = useRef<any>();
  
  // State for selected tab
  const [activeTab, setActiveTab] = useState<ReportType>('legal');
  
  // State for grid data
  const [rowData, setRowData] = useState<any[]>([]);
  
  // State for search
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // State for selected rows
  const [selectedRowCount, setSelectedRowCount] = useState(0);
  
  // State for filtered rows
  const [filteredRowCount, setFilteredRowCount] = useState(0);
  
  // Theme-specific tab styles
  const tabStyles = {
    tabIndicator: {
      backgroundColor: theme === 'dark' ? '#60CDFF' : '#0078D4',
    },
    selectedTabIcon: {
      color: theme === 'dark' ? '#60CDFF' : '#0078D4',
    }
  };
  
  // Create a reusable cell style function
  const getStatusCellStyle = (params: any) => {
    if (params.value === 'Paid') {
      return theme === 'dark' 
        ? { color: '#7FBA00', backgroundColor: 'rgba(127, 186, 0, 0.1)' }
        : { color: '#107C10', backgroundColor: 'rgba(16, 124, 16, 0.1)' };
    }
    if (params.value === 'Overdue') {
      return theme === 'dark'
        ? { color: '#FF8C00', backgroundColor: 'rgba(255, 140, 0, 0.1)' }
        : { color: '#D83B01', backgroundColor: 'rgba(216, 59, 1, 0.1)' };
    }
    if (params.value === 'Disputed') {
      return theme === 'dark'
        ? { color: '#E74856', backgroundColor: 'rgba(231, 72, 86, 0.1)' }
        : { color: '#A4262C', backgroundColor: 'rgba(164, 38, 44, 0.1)' };
    }
    // Always return a non-empty object with defined values
    return { color: '', backgroundColor: '' };
  };
  
  // Column definitions for different report types
  const legalEntityColumnDefs = useMemo(() => [
    {
      headerName: 'Company',
      field: 'companyName',
      filter: true,
      sortable: true,
      // cellRenderer: 'agGroupCellRenderer',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      minWidth: 180
    },
    {
      headerName: 'Tax ID',
      field: 'taxId',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Tax Type',
      field: 'taxType',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Amount ($)',
      field: 'amount',
      filter: 'agNumberColumnFilter',
      sortable: true,
      editable: true,
      valueFormatter: (params: any) => params.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      filter: 'agDateColumnFilter',
      sortable: true
    },
    {
      headerName: 'Status',
      field: 'status',
      filter: true,
      sortable: true,
      cellStyle: getStatusCellStyle
    },
    {
      headerName: 'Fine ($)',
      field: 'fine',
      filter: 'agNumberColumnFilter',
      sortable: true,
      valueFormatter: (params: any) => params.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    },
    {
      headerName: 'Last Payment',
      field: 'lastPaymentDate',
      filter: 'agDateColumnFilter',
      sortable: true
    }
  ], [theme]);
  
  const individualColumnDefs = useMemo(() => [
    {
      headerName: 'Name',
      field: 'fullName',
      filter: true,
      sortable: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      minWidth: 180
    },
    {
      headerName: 'SSN',
      field: 'socialSecurityNumber',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Tax Type',
      field: 'taxType',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Amount ($)',
      field: 'amount',
      filter: 'agNumberColumnFilter',
      sortable: true,
      editable: true,
      valueFormatter: (params: any) => params.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      filter: 'agDateColumnFilter',
      sortable: true
    },
    {
      headerName: 'Status',
      field: 'status',
      filter: true,
      sortable: true,
      cellStyle: getStatusCellStyle
    },
    {
      headerName: 'Fine ($)',
      field: 'fine',
      filter: 'agNumberColumnFilter',
      sortable: true,
      valueFormatter: (params: any) => params.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    }
  ], [theme]);
  
  const entrepreneurColumnDefs = useMemo(() => [
    {
      headerName: 'Business',
      field: 'businessName',
      filter: true,
      sortable: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      minWidth: 180
    },
    {
      headerName: 'Owner',
      field: 'ownerName',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Business ID',
      field: 'businessId',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Tax Type',
      field: 'taxType',
      filter: true,
      sortable: true
    },
    {
      headerName: 'Amount ($)',
      field: 'amount',
      filter: 'agNumberColumnFilter',
      sortable: true,
      editable: true,
      valueFormatter: (params: any) => params.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    },
    {
      headerName: 'Due Date',
      field: 'dueDate',
      filter: 'agDateColumnFilter',
      sortable: true
    },
    {
      headerName: 'Status',
      field: 'status',
      filter: true,
      sortable: true,
      cellStyle: getStatusCellStyle
    },
    {
      headerName: 'Fine ($)',
      field: 'fine',
      filter: 'agNumberColumnFilter',
      sortable: true,
      valueFormatter: (params: any) => params.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    },
    {
      headerName: 'Quarterly Filing',
      field: 'quarterlyFiling',
      filter: true,
      sortable: true,
      valueFormatter: (params: any) => params.value ? 'Yes' : 'No'
    }
  ], [theme]);
  
  // Default column definitions
  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true,
    floatingFilter: true
  }), []);
  
  // Get active column definitions based on selected tab
  const getActiveColumnDefs = () => {
    switch (activeTab) {
      case 'legal':
        return legalEntityColumnDefs;
      case 'individual':
        return individualColumnDefs;
      case 'entrepreneur':
        return entrepreneurColumnDefs;
      default:
        return legalEntityColumnDefs;
    }
  };
  
  // Detail cell renderer params

  
  // Load data based on active tab
  useEffect(() => {
    let data: any[] = [];
    
    switch (activeTab) {
      case 'legal':
        data = generateLegalEntityData(50);
        break;
      case 'individual':
        data = generateIndividualData(50);
        break;
      case 'entrepreneur':
        data = generateEntrepreneurData(50);
        break;
    }
    
    setRowData(data);
  }, [activeTab]);
  
  // Handle tab change
  const handleTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value as ReportType);
  };
  
  // Get grid theme based on application theme
  const getGridTheme = () => {
    return theme === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz';
  };
  
  // Handle adding a new row
  const onAddRow = useCallback(() => {
    let newRow: any = {};
    
    switch (activeTab) {
      case 'legal':
        newRow = {
          id: Math.floor(Math.random() * 1000000),
          companyName: '',
          taxId: '',
          taxType: '',
          amount: 0,
          dueDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
          fine: 0,
          lastPaymentDate: '',
          callRecords: []
        };
        break;
      case 'individual':
        newRow = {
          id: Math.floor(Math.random() * 1000000),
          fullName: '',
          socialSecurityNumber: '',
          taxType: '',
          amount: 0,
          dueDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
          fine: 0
        };
        break;
      case 'entrepreneur':
        newRow = {
          id: Math.floor(Math.random() * 1000000),
          businessName: '',
          ownerName: '',
          businessId: '',
          taxType: '',
          amount: 0,
          dueDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
          fine: 0,
          quarterlyFiling: false
        };
        break;
    }
    
    setRowData([newRow, ...rowData]);
  }, [activeTab, rowData]);
  
  // Handle deleting selected rows
  const onDeleteSelected = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedIds = selectedNodes.map((node: any) => node.data.id);
    
    setRowData(rowData.filter(row => !selectedIds.includes(row.id)));
  }, [rowData]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    let freshData: any[] = [];
    
    switch (activeTab) {
      case 'legal':
        freshData = generateLegalEntityData(50);
        break;
      case 'individual':
        freshData = generateIndividualData(50);
        break;
      case 'entrepreneur':
        freshData = generateEntrepreneurData(50);
        break;
    }
    
    setRowData(freshData);
  }, [activeTab]);

  // Handle save
  const onSave = useCallback(() => {
    alert('Data saved successfully!');
  }, []);

  // Handle export to PDF
  const onExportPdf = useCallback(() => {
    alert('Exporting to PDF...');
  }, []);

  // Handle export to Excel
  const onExportExcel = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.exportDataAsCsv({
        fileName: `tax-reports-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`
      });
    }
  }, [activeTab]);

  // Handle calculate
  const onCalculate = useCallback(() => {
    const updatedData = rowData.map(row => {
      // Simple calculation example: If status is overdue, add 10% fine
      if (row.status === 'Overdue' && row.fine === 0) {
        return {
          ...row,
          fine: row.amount * 0.1,
          hasFines: true
        };
      }
      return row;
    });
    
    setRowData(updatedData);
    alert('Calculations completed.');
  }, [rowData]);

  // Handle analytics
  const onAnalytics = useCallback(() => {
    alert('Analytics feature will be available in the next release.');
  }, []);

  // Handle filter button click
  const onFilter = useCallback(() => {
    // This simply toggles the AG Grid's filter UI visibility
    if (gridRef.current && gridRef.current.api) {
      const filterInstance = gridRef.current.api.getFilterInstance('status');
      if (filterInstance) {
        filterInstance.setModel({ 
          type: 'set', 
          values: ['Overdue', 'Disputed'] 
        });
        gridRef.current.api.onFilterChanged();
      }
    }
  }, []);

  // Handle search
  const onSearch = useCallback((searchValue: string) => {
    setSearchText(searchValue);
    setIsSearching(searchValue.length > 0);
    
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setQuickFilter(searchValue);
      // Update filtered rows count after a small delay to allow filtering to complete
      setTimeout(() => {
        setFilteredRowCount(gridRef.current.api.getDisplayedRowCount());
      }, 100);
    }
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchText('');
    setIsSearching(false);
    
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.setQuickFilter('');
      setFilteredRowCount(rowData.length);
    }
  }, [rowData.length]);
  
  // Handle row selection change
  const onSelectionChanged = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      const selectedNodes = gridRef.current.api.getSelectedNodes();
      setSelectedRowCount(selectedNodes.length);
    }
  }, []);
  
  // Handle model updated (when filtering changes)
  const onModelUpdated = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      setFilteredRowCount(gridRef.current.api.getDisplayedRowCount());
    }
  }, []);
  
  return (
    <Window
      id="reports"
      title="Tax Reports"
      initialWidth={1200}
      initialHeight={800}
      icon="/src/assets/icons/report.svg"
      isFullSize={true}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <TabList 
            selectedValue={activeTab}
            onTabSelect={handleTabSelect}
            className={styles.windows11Tabs}
            style={{
              '--tab-indicator-color': tabStyles.tabIndicator.backgroundColor,
              '--tab-selected-icon-color': tabStyles.selectedTabIcon.color,
            } as React.CSSProperties}
          >
            <Tab id="legal" value="legal" className={activeTab === 'legal' ? styles.activeTab : ''} icon={<Money20Regular />}>
              Legal Entities
            </Tab>
            <Tab id="individual" value="individual" className={activeTab === 'individual' ? styles.activeTab : ''} icon={<PersonMoney20Regular />}>
              Individuals
            </Tab>
            <Tab id="entrepreneur" value="entrepreneur" className={activeTab === 'entrepreneur' ? styles.activeTab : ''} icon={<Receipt20Regular />}>
              Entrepreneurs
            </Tab>
          </TabList>
          <div className={styles.searchContainer}>
            <Input 
              placeholder="Search..." 
              value={searchText}
              onChange={(e, data) => onSearch(data.value)}
              className={mergeClasses(
                styles.searchInput, 
                isSearching && styles.activeSearch
              )}
              contentBefore={<Search20Regular />}
              contentAfter={
                isSearching ? 
                  <Delete20Regular 
                    style={{ opacity: 0.7 }} 
                    className={styles.searchIcon} 
                    onClick={clearSearch} 
                  /> : 
                  null
              }
            />
          </div>
        </div>
        
        <ReportsToolbar 
          onAddRow={onAddRow}
          onDeleteSelected={onDeleteSelected}
          onRefresh={onRefresh}
          onSave={onSave}
          onExportPdf={onExportPdf}
          onExportExcel={onExportExcel}
          onCalculate={onCalculate}
          onAnalytics={onAnalytics}
          onFilter={onFilter}
        />
        
        <div className={styles.gridContainer}>
          <div 
            className={mergeClasses(
              styles.grid, 
              getGridTheme()
            )}
            style={{ width: '100%', height: '100%' }}
          >
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              rowModelType='clientSide'
              theme={theme === "dark" ? themeBalham.withPart(colorSchemeDark) : themeBalham.withPart(colorSchemeLight)}
              
              columnDefs={getActiveColumnDefs()}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 25, 50, 100]}
              // masterDetail={activeTab === 'legal'}
              // detailCellRendererParams={detailCellRendererParams}
              rowHeight={40}
              headerHeight={48}
              animateRows={true}
              suppressRowClickSelection={true}
              domLayout="normal"
              quickFilterText={searchText}
              onSelectionChanged={onSelectionChanged}
              onModelUpdated={onModelUpdated}
            />
          </div>
        </div>
        
        <div className={styles.statusBar}>
          <div className={styles.statusSection}>
            <span>Total Records: {rowData.length}</span>
            {selectedRowCount > 0 && (
              <>
                <div className={styles.statusDivider} />
                <span>
                  Selected: <span className={styles.statusHighlight}>{selectedRowCount}</span>
                </span>
              </>
            )}
          </div>
          <div className={styles.statusSection}>
            {isSearching && (
              <>
                <span>
                  Search Results: <span className={styles.statusHighlight}>{filteredRowCount}</span>
                </span>
                <div className={styles.statusDivider} />
              </>
            )}
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Window>
  );
});

// Styles for the Reports component
