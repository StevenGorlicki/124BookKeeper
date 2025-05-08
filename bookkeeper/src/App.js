import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import ExamplePage from './pages/ExamplePage';
import AboutPage from './pages/AboutPage';
import ReadingList from './pages/ReadingList';
import Notes from './pages/Notes';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Books from './pages/Books';
import FAQ from './pages/FAQ';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/example" element={<ExamplePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reading-list" element={<ReadingList />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/books" element={<Books />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </Router>
  );
}

export default App;
