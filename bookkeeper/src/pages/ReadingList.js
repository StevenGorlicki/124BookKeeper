import Header from '../reusableItems/Header';
import Footer from '../reusableItems/Footer';
import '../assets/globalStyles/global.css';
import '../assets/globalStyles/readingList.css';
import { Link, useLocation } from 'react-router-dom';

function ReadingList() {
  const location = useLocation();
  const isActive = (path, filter) => {
    if (filter) {
      return location.pathname === path && new URLSearchParams(location.search).get('filter') === filter;
    }
    if (path === '/reading-list' && !location.search) {
      return location.pathname === path;
    }
    return false;
  };

  return (
    <>
      <Header />
      <main className="reading-list-container">
        <nav className="reading-list-nav">
          <Link to="/reading-list" className={`nav-btn${isActive('/reading-list') ? ' active' : ''}`}>All Lists</Link>
          <Link to="/reading-list?filter=currently-reading" className={`nav-btn${isActive('/reading-list', 'currently-reading') ? ' active' : ''}`}>Currently Reading</Link>
          <Link to="/reading-list?filter=want-to-read" className={`nav-btn${isActive('/reading-list', 'want-to-read') ? ' active' : ''}`}>Want to Read</Link>
          <Link to="/reading-list?filter=completed" className={`nav-btn${isActive('/reading-list', 'completed') ? ' active' : ''}`}>Completed</Link>
          <Link to="/reading-list/create" className="create-list-btn">+ Create New List</Link>
        </nav>
        <section className="reading-list-columns">
          {/* Currently Reading */}
          <div className="reading-list-column">
            <h2>Currently Reading</h2>
            <div className="book-card">
              <div className="book-cover-placeholder">Book</div>
              <div className="book-info">
                <div className="book-title">Title</div>
                <div className="book-author">Author</div>
                <div className="book-completion">_____ Completion ______</div>
              </div>
            </div>
            <div className="book-card">
              <div className="book-cover-placeholder">Book</div>
              <div className="book-info">
                <div className="book-title">Title</div>
                <div className="book-author">Author</div>
                <div className="book-completion">_____ Completion ______</div>
              </div>
            </div>
            <div className="view-all">View All &rarr;</div>
          </div>
          {/* Want to Read */}
          <div className="reading-list-column">
            <h2>Want to Read</h2>
            <div className="book-card">
              <div className="book-cover-placeholder">Book</div>
              <div className="book-info">
                <div className="book-title">Title</div>
                <div className="book-author">Author</div>
                <div className="book-completion">_____ Completion ______</div>
              </div>
            </div>
            <div className="book-card">
              <div className="book-cover-placeholder">Book</div>
              <div className="book-info">
                <div className="book-title">Title</div>
                <div className="book-author">Author</div>
                <div className="book-completion">_____ Completion ______</div>
              </div>
            </div>
            <div className="view-all">View All &rarr;</div>
          </div>
          {/* Recently Completed */}
          <div className="reading-list-column">
            <h2>Recently Completed</h2>
            <div className="book-card">
              <div className="book-cover-placeholder">Book</div>
              <div className="book-info">
                <div className="book-title">Title</div>
                <div className="book-author">Author</div>
                <div className="book-completion">_____ Completion ______</div>
              </div>
            </div>
            <div className="book-card">
              <div className="book-cover-placeholder">Book</div>
              <div className="book-info">
                <div className="book-title">Title</div>
                <div className="book-author">Author</div>
                <div className="book-completion">_____ Completion ______</div>
              </div>
            </div>
            <div className="view-all">View All &rarr;</div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ReadingList;
