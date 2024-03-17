import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom';
import HistogramDots from './components/HistogramDots';
import HistogramConfig from './components/HistogramConfig';
import './App.css';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function App() {
  return (
    <Router>
      <Container maxWidth="lg">
        <Box sx={
          { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }
        }>
          <h2><Link to="/">Dots to Data</Link></h2>
        </Box>

      <div>
        {/* ページ遷移の定義 */}
        <Routes>
          <Route path="/" element={<HistogramConfig />} />
          <Route path="/histogram/" element={<HistogramDots />} />
        </Routes>
      </div>
      </Container>

    </Router>
  );
}

export default App;