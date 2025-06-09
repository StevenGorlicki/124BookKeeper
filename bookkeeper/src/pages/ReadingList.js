import Header from '../reusableItems/Header';
import Footer from '../reusableItems/Footer';
import '../assets/globalStyles/global.css';
import '../assets/globalStyles/readingList.css';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../api/axios';

function ReadingList() {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [listToDelete, setListToDelete] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBookList, setSelectedBookList] = useState(null);
  const [selectedBookIndex, setSelectedBookIndex] = useState(null);
  const [noteFormData, setNoteFormData] = useState({
    bookTitle: '',
    author: '',
    content: ''
  });
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set of default lists that cannot be deleted
  const defaultLists = new Set(['currently-reading', 'want-to-read', 'completed']);

  const completionOptions = ['0%', '5%', '10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%', '55%', '60%', '65%', '70%', '75%', '80%', '85%', '90%', '95%', '100%'];

  // Load reading lists from backend
  useEffect(() => {
    const loadLists = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await API.get('/reading-lists', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Convert array of lists to object format for easier manipulation
        const listsObject = {};
        res.data.forEach(list => {
          // Convert list name to URL-friendly key
          const listKey = list.name.toLowerCase().replace(/\s+/g, '-');
          listsObject[listKey] = list.books || [];
          // Store the list ID for backend operations
          listsObject[listKey]._id = list._id;
        });

        // Ensure default lists exist
        if (!listsObject['currently-reading']) {
          await createDefaultList('Currently Reading');
          listsObject['currently-reading'] = [];
        }
        if (!listsObject['want-to-read']) {
          await createDefaultList('Want to Read');
          listsObject['want-to-read'] = [];
        }
        if (!listsObject['completed']) {
          await createDefaultList('Completed');
          listsObject['completed'] = [];
        }

        setLists(listsObject);
      } catch (err) {
        console.error('Error fetching reading lists:', err);
        setError('Failed to load reading lists');
      } finally {
        setLoading(false);
      }
    };

    loadLists();
  }, []);

  const createDefaultList = async (name) => {
    try {
      const token = localStorage.getItem('token');
      await API.post('/reading-lists', { name }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Error creating default list:', err);
    }
  };

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

  const openBookModal = (book, listKey, bookIndex) => {
    setSelectedBook({...book});
    setSelectedBookList(listKey);
    setSelectedBookIndex(bookIndex);
    setShowBookModal(true);
  };

  const closeBookModal = () => {
    setShowBookModal(false);
    setSelectedBook(null);
    setSelectedBookList(null);
    setSelectedBookIndex(null);
  };

  const openNoteModal = (book, e) => {
    e.stopPropagation(); // Prevent book modal from opening
    setNoteFormData({
      bookTitle: book.title,
      author: book.author,
      content: ''
    });
    setShowNoteModal(true);
  };

  const closeNoteModal = () => {
    setShowNoteModal(false);
    setNoteFormData({ bookTitle: '', author: '', content: '' });
  };

  const handleNoteInputChange = (e) => {
    const { name, value } = e.target;
    setNoteFormData({ ...noteFormData, [name]: value });
  };

  const handleDeleteList = async () => {
    if (listToDelete && !defaultLists.has(listToDelete)) {
      try {
        const token = localStorage.getItem('token');
        const listId = lists[listToDelete]._id;

        await API.delete(`/reading-lists/${listId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const newLists = {...lists};
        delete newLists[listToDelete];
        setLists(newLists);
        closeDeleteModal();
      } catch (err) {
        console.error('Error deleting list:', err);
        setError('Failed to delete list');
      }
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      try {
        const token = localStorage.getItem('token');
        const res = await API.post('/reading-lists', { name: newListName }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Convert to a URL-friendly key
        const listKey = newListName.toLowerCase().replace(/\s+/g, '-');

        // Add the new list to our lists state
        const newList = [];
        newList._id = res.data._id;
        setLists({
          ...lists,
          [listKey]: newList
        });

        closeModal();
      } catch (err) {
        console.error('Error creating list:', err);
        setError('Failed to create list');
      }
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    if (selectedBook && selectedBookList !== null && selectedBookIndex !== null) {
      try {
        const token = localStorage.getItem('token');
        const listId = lists[selectedBookList]._id;

        // Update the book in the backend
        await API.put(`/reading-lists/${listId}/books/${selectedBookIndex}`, selectedBook, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const newLists = {...lists};
        newLists[selectedBookList][selectedBookIndex] = {...selectedBook};
        setLists(newLists);
        closeBookModal();
      } catch (err) {
        console.error('Error updating book:', err);
        setError('Failed to update book');
      }
    }
  };

  const handleRemoveBook = async () => {
    if (selectedBookList !== null && selectedBookIndex !== null) {
      try {
        const token = localStorage.getItem('token');
        const listId = lists[selectedBookList]._id;

        await API.delete(`/reading-lists/${listId}/books/${selectedBookIndex}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const newLists = {...lists};
        newLists[selectedBookList].splice(selectedBookIndex, 1);
        setLists(newLists);
        closeBookModal();
      } catch (err) {
        console.error('Error removing book:', err);
        setError('Failed to remove book');
      }
    }
  };

  const handleMoveBook = async (targetList) => {
    if (selectedBook && selectedBookList !== null && selectedBookIndex !== null && targetList !== selectedBookList) {
      try {
        const token = localStorage.getItem('token');

        // Remove from current list
        const currentListId = lists[selectedBookList]._id;
        await API.delete(`/reading-lists/${currentListId}/books/${selectedBookIndex}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Add to target list
        const targetListId = lists[targetList]._id;
        await API.post(`/reading-lists/${targetListId}/books`, selectedBook, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const newLists = {...lists};
        // Remove from current list
        newLists[selectedBookList].splice(selectedBookIndex, 1);
        // Add to target list
        if (!newLists[targetList]) {
          newLists[targetList] = [];
        }
        newLists[targetList].push({...selectedBook});

        setLists(newLists);
        closeBookModal();
      } catch (err) {
        console.error('Error moving book:', err);
        setError('Failed to move book');
      }
    }
  };

  const createNote = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.post('/notes', noteFormData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      closeNoteModal();
      // You might want to show a success message here
      console.log('Note created successfully:', res.data);
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note');
    }
  };

  // Determine which lists to show based on the URL filter
  const filter = new URLSearchParams(location.search).get('filter');
  const listsToShow = filter ? { [filter]: lists[filter] } : lists;

  if (loading) {
    return (
      <>
        <Header />
        <main className="reading-list-container">
          <div className="loading">Loading your reading lists...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="reading-list-container">
          <div className="error">{error}</div>
        </main>
        <Footer />
      </>
    );
  }

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

        {/* Modal for editing a book */}
        {showBookModal && selectedBook && (
          <div className="modal-overlay">
            <div className="modal-content book-edit-modal">
              <h2>Edit Book</h2>
              <form onSubmit={handleUpdateBook}>
                <div className="form-group">
                  <label htmlFor="bookTitle">Title:</label>
                  <input
                    type="text"
                    id="bookTitle"
                    value={selectedBook.title}
                    onChange={(e) => setSelectedBook({...selectedBook, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bookAuthor">Author:</label>
                  <input
                    type="text"
                    id="bookAuthor"
                    value={selectedBook.author}
                    onChange={(e) => setSelectedBook({...selectedBook, author: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bookCompletion">Completion:</label>
                  <select
                    id="bookCompletion"
                    value={selectedBook.completion}
                    onChange={(e) => setSelectedBook({...selectedBook, completion: e.target.value})}
                  >
                    {completionOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="move-book-section">
                  <label>Move to list:</label>
                  <div className="move-buttons">
                    {Object.keys(lists).map(listKey => (
                      <button
                        key={listKey}
                        type="button"
                        onClick={() => handleMoveBook(listKey)}
                        className={`move-btn ${listKey === selectedBookList ? 'current-list' : ''}`}
                        disabled={listKey === selectedBookList}
                      >
                        {listKey === 'completed'
                          ? 'Recently Completed'
                          : listKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                        }
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={handleRemoveBook} className="delete-btn">Remove Book</button>
                  <button type="button" onClick={closeBookModal} className="cancel-btn">Cancel</button>
                  <button type="submit" className="create-btn">Update Book</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for adding a note - matches NotesPage structure */}
        {showNoteModal && (
          <div className="modal-overlay">
            <div className="modal-content note-modal">
              <div className="modal-header">
                <h2>Create New Note</h2>
                <button
                  className="modal-close"
                  onClick={closeNoteModal}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="bookTitle">Book Title</label>
                  <input
                    type="text"
                    id="bookTitle"
                    name="bookTitle"
                    value={noteFormData.bookTitle}
                    onChange={handleNoteInputChange}
                    className="input"
                    placeholder="Enter book title"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="author">Author</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={noteFormData.author}
                    onChange={handleNoteInputChange}
                    className="input"
                    placeholder="Enter author name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="content">Note Content</label>
                  <textarea
                    id="content"
                    name="content"
                    value={noteFormData.content}
                    onChange={handleNoteInputChange}
                    className="textarea"
                    placeholder="Enter your note"
                    rows="6"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closeNoteModal}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={createNote}
                  disabled={!noteFormData.bookTitle || !noteFormData.content}
                >
                  Create Note
                </button>
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
                <div className="list-header-actions">
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
              </div>
              {lists[filter]?.map((book, index) => (
                <div
                  className="book-card clickable"
                  key={index}
                  onClick={() => openBookModal(book, filter, index)}
                >
                  <button
                    className="add-note-btn book-note-btn"
                    onClick={(e) => openNoteModal(book, e)}
                    title="Add note for this book"
                  >
                    📝
                  </button>
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
                    <div className="list-header-actions">
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
                  </div>
                  {books.slice(0, 2).map((book, index) => (
                    <div
                      className="book-card clickable"
                      key={index}
                      onClick={() => openBookModal(book, key, index)}
                    >
                      <button
                        className="add-note-btn book-note-btn"
                        onClick={(e) => openNoteModal(book, e)}
                        title="Add note for this book"
                      >
                        📝
                      </button>
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