import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom';
import HistogramDots from './components/HistogramDots';
import HistogramConfig from './components/HistogramConfig';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/dots-to-data/">Home</Link>
            </li>
            <li>
              <Link to="/dots-to-data/histogram">histogram</Link>
            </li>
          </ul>
        </nav>

        {/* ページ遷移の定義 */}
        <Routes>
          <Route path="/dots-to-data/" element={<HistogramConfig />} />
          <Route path="/dots-to-data/histogram/" element={<HistogramDots />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;