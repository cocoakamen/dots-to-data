import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom';
import HistogramDots from './components/HistogramDots';
import HistogramConfig from './components/HistogramConfig';
// import './App.css';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function App() {
  return (
    <Router>
        <Container maxWidth="lg" sx={{ alignItems: 'center',}}>
            <Box sx={
              { display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: 1,
            }
            }>
              <strong><Link to="/">Dots to Data</Link></strong>
            </Box>

            {/* ページ遷移の定義 */}
            <Routes>
              <Route path="/" element={<HistogramConfig />} />
              <Route path="/histogram/" element={<HistogramDots />} />
            </Routes>
        </Container>



    </Router>
  );
}

export default App;