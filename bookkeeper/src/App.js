import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import ExamplePage from './pages/ExamplePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/example" element={<ExamplePage />} />
      </Routes>
    </Router>
  );
}

export default App;
