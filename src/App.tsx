import { useState } from 'react';
import { ThemeProvider, CssBaseline, Tabs, Tab, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Dashboard from './components/Dashboard';
import About from './components/About';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          aria-label="sistema de previsão de deslizamentos"
          centered
        >
          <Tab label="Dashboard" />
          <Tab label="Sobre o Projeto" />
        </Tabs>
      </Box>
      
      {currentTab === 0 && <Dashboard />}
      {currentTab === 1 && <About />}
    </ThemeProvider>
  );
}

export default App;