import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HerbDetails from './pages/HerbDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/herbs/:id" element={<HerbDetails />} />
          <Route path="/herb/:slug" element={<HerbDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

