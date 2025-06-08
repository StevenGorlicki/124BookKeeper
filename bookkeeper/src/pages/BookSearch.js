import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../reusableItems/Header';
import Footer from '../reusableItems/Footer';
import '../assets/globalStyles/global.css';
import './BookSearch.css';

function BookSearch() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleOpenLibrarySearch({ preventDefault: () => {} });
    }
  }, [searchParams]);

  const handleOpenLibrarySearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearchResults([]);

    try {
      // Open Library API call
      const openLibraryResponse = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=10`);
      const openLibraryData = await openLibraryResponse.json();

      if (openLibraryData.docs) {
        const results = openLibraryData.docs.map(book => ({
          id: book.key,
          title: book.title,
          author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
          cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
          description: book.description || 'Description not available',
          publishedDate: book.first_publish_year || 'Unknown',
          pageCount: book.number_of_pages_median || 'Unknown',
          source: 'Open Library'
        }));

        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(`Failed to search for books: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExternalSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowWebsiteModal(true);
  };

  const searchOnExternalWebsite = (website) => {
    if (!searchQuery.trim()) return;

    const websiteUrls = {
      amazon: `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}`,
      goodreads: `https://www.goodreads.com/search?q=${encodeURIComponent(searchQuery)}`,
      audible: `https://www.audible.com/search?keywords=${encodeURIComponent(searchQuery)}`,
      hoopla: `https://www.hoopladigital.com/search?q=${encodeURIComponent(searchQuery)}&scope=everything&type=direct`,
      chirp: `https://www.chirpbooks.com/search?q=${encodeURIComponent(searchQuery)}`
    };

    const url = websiteUrls[website];
    if (url) {
      window.open(url, '_blank');
    }

    setShowWebsiteModal(false);
  };

  const addToReadingList = (bookId, listType) => {
    // In a real implementation, this would save to your database or local storage
    console.log(`Added book ${bookId} to ${listType} list`);

    // You could show a success message here
    alert(`Book added to your "${listType}" list!`);
  };

  return (
    <>
      <Header />
      <main className="book-search-container">
        <h1 className="book-search-title">Discover Your Next Book</h1>

        <div className="book-search-panel">
          <form className="book-search-form">
            <div className="book-search-input-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for books by title, author, or ISBN..."
                className="book-search-input"
              />
              <div className="book-search-buttons">
                <button
                  type="button"
                  onClick={handleOpenLibrarySearch}
                  className="book-search-button primary-button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Search Open Library
                </button>
                <button
                  type="button"
                  onClick={handleExternalSearch}
                  className="book-search-button secondary-button"
                >
                  Search Other Websites
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* External Website Search Modal */}
        {showWebsiteModal && (
          <div className="website-modal-overlay">
            <div className="website-modal">
              <h3>Choose a website to search</h3>
              <div className="website-buttons">
                <button onClick={() => searchOnExternalWebsite('amazon')}>Amazon</button>
                <button onClick={() => searchOnExternalWebsite('goodreads')}>Goodreads</button>
                <button onClick={() => searchOnExternalWebsite('audible')}>Audible</button>
                <button onClick={() => searchOnExternalWebsite('hoopla')}>Hoopla</button>
                <button onClick={() => searchOnExternalWebsite('chirp')}>Chirp</button>
              </div>
              <button
                onClick={() => setShowWebsiteModal(false)}
                className="close-modal-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="book-search-results-container">
          {isLoading && (
            <div className="book-search-loading-indicator">
              <div className="book-search-spinner"></div>
              <p>Searching for books...</p>
            </div>
          )}

          {error && <div className="book-search-error-message">{error}</div>}

          {!isLoading && searchResults.length === 0 && searchQuery && !error && (
            <div className="book-search-no-results">No books found. Try a different search term.</div>
          )}

          {searchResults.length > 0 && (
            <>
              <div className="book-search-results-header">
                <h2>Search Results</h2>
                <p>{searchResults.length} books found from Open Library</p>
              </div>

              <div className="book-search-results">
                {searchResults.map(book => (
                  <div key={book.id} className="book-search-result-card">
                    <div className="book-search-cover">
                      {book.cover ? (
                        <img src={book.cover} alt={`Cover of ${book.title}`} />
                      ) : (
                        <div className="book-search-cover-placeholder">
                          <span>{book.title.substring(0, 1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="book-search-details">
                      <h3 className="book-search-title-text">{book.title}</h3>
                      <p className="book-search-author">by {book.author}</p>

                      <div className="book-search-meta">
                        <span className="book-search-year">{book.publishedDate}</span>
                        {book.pageCount !== 'Unknown' && (
                          <span className="book-search-pages">{book.pageCount} pages</span>
                        )}
                      </div>

                      <p className="book-search-description">
                        {book.description && book.description.length > 200
                          ? book.description.substring(0, 200) + '...'
                          : book.description}
                      </p>

                      <div className="book-search-actions">
                        <button
                          onClick={() => addToReadingList(book.id, 'currently-reading')}
                          className="book-search-action-btn book-search-reading-btn"
                        >
                          + Currently Reading
                        </button>
                        <button
                          onClick={() => addToReadingList(book.id, 'want-to-read')}
                          className="book-search-action-btn book-search-want-btn"
                        >
                          + Want to Read
                        </button>
                        <button
                          onClick={() => addToReadingList(book.id, 'completed')}
                          className="book-search-action-btn book-search-completed-btn"
                        >
                          + Completed
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default BookSearch;