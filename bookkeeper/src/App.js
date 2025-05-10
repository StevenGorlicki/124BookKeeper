import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import ExamplePage from './pages/ExamplePage';
import AboutPage from './pages/AboutPage';
import ReadingList from './pages/ReadingList';
import Notes from './pages/NotesPage';
import Profile from './pages/Profile';
import BookSearch from './pages/BookSearch';
import Books from './pages/Books';
import FAQ from './pages/FAQPage';
import NotFound from './pages/NotFound'
import Share from './pages/Share'

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
        <Route path="/book-search" element={<BookSearch />} />
        <Route path="/books" element={<Books />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/share" element={<Share />} />


        {/*  KEEP THIS AS THE LAST ROUTE AS FALLBACK*/}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;