/**
 * Main App Router
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DSAPage from './pages/DSAPage';
import TheoryPage from './pages/TheoryPage';
import { RouteLoadingIndicator } from './components/RouteLoadingIndicator';

function App() {
  return (
    <BrowserRouter>
      <RouteLoadingIndicator />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dsa" element={<DSAPage />} />
        <Route path="/os" element={<TheoryPage subject="OS" />} />
        <Route path="/dbms" element={<TheoryPage subject="DBMS" />} />
        <Route path="/oops" element={<TheoryPage subject="OOPS" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
