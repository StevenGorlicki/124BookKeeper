import Header from '../reusableItems/Header';
import Footer from '../reusableItems/Footer';
import '../assets/globalStyles/global.css';
import '../assets/globalStyles/readingList.css';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

function ReadingList() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [listToDelete, setListToDelete] = useState(null);
  const [lists, setLists] = useState({
    'currently-reading': [
      { title: 'Title', author: 'Author', completion: '_____ Completion ______' },
      { title: 'Title', author: 'Author', completion: '_____ Completion ______' }
    ],
    'want-to-read': [
      { title: 'Title', author: 'Author', completion: '_____ Completion ______' },
      { title: 'Title', author: 'Author', completion: '_____ Completion ______' }
    ],
    'completed': [
      { title: 'Title', author: 'Author', completion: '_____ Completion ______' },
      { title: 'Title', author: 'Author', completion: '_____ Completion ______' }
    ]
  });

  // Set of default lists that cannot be deleted
  const defaultLists = new Set(['currently-reading', 'want-to-read', 'completed']);

  const isActive = (path, filter) => {
    if (filter) {
      return location.pathname === path && new URLSearchParams(location.search).get('filter') === filter;
    }
    if (path === '/reading-list' && !location.search) {
      return location.pathname === path;
    }
    return false;
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewListName('');
  };

  const openDeleteModal = (listKey) => {
    setListToDelete(listKey);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setListToDelete(null);
  };

  const handleDeleteList = () => {
    if (listToDelete && !defaultLists.has(listToDelete)) {
      const newLists = {...lists};
      delete newLists[listToDelete];
      setLists(newLists);
      closeDeleteModal();
    }
  };

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      // Convert to a URL-friendly key
      const listKey = newListName.toLowerCase().replace(/\s+/g, '-');

      // Add the new list to our lists state
      setLists({
        ...lists,
        [listKey]: []
      });

      closeModal();
    }
  };

  // Determine which lists to show based on the URL filter
  const filter = new URLSearchParams(location.search).get('filter');
  const listsToShow = filter ? { [filter]: lists[filter] } : lists;

  return (
    <>
      <Header />
      <main className="reading-list-container">
        <nav className="reading-list-nav">
          <Link to="/reading-list" className={`nav-btn${isActive('/reading-list') ? ' active' : ''}`}>All Lists</Link>
          <Link to="/reading-list?filter=currently-reading" className={`nav-btn${isActive('/reading-list', 'currently-reading') ? ' active' : ''}`}>Currently Reading</Link>
          <Link to="/reading-list?filter=want-to-read" className={`nav-btn${isActive('/reading-list', 'want-to-read') ? ' active' : ''}`}>Want to Read</Link>
          <Link to="/reading-list?filter=completed" className={`nav-btn${isActive('/reading-list', 'completed') ? ' active' : ''}`}>Completed</Link>
          <button onClick={openModal} className="create-list-btn">+ Create New List</button>
        </nav>

        {/* Modal for creating a new list */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Create New Reading List</h2>
              <form onSubmit={handleCreateList}>
                <div className="form-group">
                  <label htmlFor="newListName">List Name:</label>
                  <input
                    type="text"
                    id="newListName"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list name"
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={closeModal} className="cancel-btn">Cancel</button>
                  <button type="submit" className="create-btn">Create List</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for confirming list deletion */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Delete Reading List</h2>
              <p className="delete-warning">
                Are you sure you want to delete this list and all of its contents?
                This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button type="button" onClick={closeDeleteModal} className="cancel-btn">Cancel</button>
                <button type="button" onClick={handleDeleteList} className="delete-btn">Delete List</button>
              </div>
            </div>
          </div>
        )}

        <section className="reading-list-columns">
          {filter ? (
            // Show only the filtered list
            <div className="reading-list-column full-width">
              <div className="list-header">
                <h2>{filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h2>
                {!defaultLists.has(filter) && (
                  <button
                    className="delete-list-btn"
                    onClick={() => openDeleteModal(filter)}
                    aria-label={`Delete ${filter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} list`}
                  >
                    &times;
                  </button>
                )}
              </div>
              {lists[filter]?.map((book, index) => (
                <div className="book-card" key={index}>
                  <div className="book-cover-placeholder">Book</div>
                  <div className="book-info">
                    <div className="book-title">{book.title}</div>
                    <div className="book-author">{book.author}</div>
                    <div className="book-completion">{book.completion}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show all lists or the default three
            Object.entries(lists).map(([key, books]) => {
              // Format the list name for display (e.g., "want-to-read" -> "Want to Read")
              const listName = key === 'completed'
                ? 'Recently Completed'
                : key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

              return (
                <div className="reading-list-column" key={key}>
                  <div className="list-header">
                    <h2>{listName}</h2>
                    {!defaultLists.has(key) && (
                      <button
                        className="delete-list-btn"
                        onClick={() => openDeleteModal(key)}
                        aria-label={`Delete ${listName} list`}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                  {books.slice(0, 2).map((book, index) => (
                    <div className="book-card" key={index}>
                      <div className="book-cover-placeholder">Book</div>
                      <div className="book-info">
                        <div className="book-title">{book.title}</div>
                        <div className="book-author">{book.author}</div>
                        <div className="book-completion">{book.completion}</div>
                      </div>
                    </div>
                  ))}
                  <div className="view-all">View All &rarr;</div>
                </div>
              );
            })
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default ReadingList;