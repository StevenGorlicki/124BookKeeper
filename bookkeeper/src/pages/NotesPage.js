import { useState, useEffect } from 'react';
import Header from '../reusableItems/Header';
import Footer from '../reusableItems/Footer';
import '../assets/globalStyles/global.css';
import './NotesPage.css';

function NotesPage() {
  // State for notes data
  const [notes, setNotes] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 9; // Display 9 notes per page

  // State for UI controls
  const [sortBy, setSortBy] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');

  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  // Form states for create/edit
  const [formData, setFormData] = useState({
    bookTitle: '',
    author: '',
    content: ''
  });

  // Load notes data
  useEffect(() => {
    // This would be replaced with actual API call to your database
    const loadNotes = async () => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 500));

        // For demo purposes, load some sample data
        // In production, this would be replaced with fetch() call to your API
        const sampleNotes = [
        {
          id: 1,
          bookTitle: 'The Design of Everyday Things',
          author: 'Don Norman',
          content: 'Heres some notes for the first book'
        },
        {
          id: 2,
          bookTitle: 'Clean Code',
          author: 'Robert C. Martin',
          content: 'Heres some notes for the second book'
        },
        {
          id: 3,
          bookTitle: 'Thinking, Fast and Slow',
          author: 'Daniel Kahneman',
          content: 'heres some notes for the third book'
        },
        {
          id: 4,
          bookTitle: 'Example Title',
          author: 'Example Author',
          content: 'Example notes'
        },
        {
          id: 5,
          bookTitle: 'Example Title',
          author: 'Example Author',
          content: 'Example notes'
        },
        {
          id: 6,
          bookTitle: 'Example Title',
          author: 'Example Author',
          content: 'Example notes'
        },
        {
          id: 7,
          bookTitle: 'Example Title',
          author: 'Example Author',
          content: 'Example notes'
        },
        {
          id: 8,
          bookTitle: 'Example Title',
          author: 'Example Author',
          content: 'Example notes'
        },
        {
          id: 9,
          bookTitle: 'Example Title',
          author: 'Example Author',
          content: 'Example notes'
        },
        {
          id: 10,
          bookTitle: 'Example Title',
          author: 'Example Author',
          content: 'Example notes'
        }
      ];


        setNotes(sampleNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };

    loadNotes();
  }, []);

  // Filter notes based on search query
  const filteredNotes = notes.filter(note =>
    note.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered notes based on selected sort option
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'title') {
      return a.bookTitle.localeCompare(b.bookTitle);
    } else if (sortBy === 'author') {
      return a.author.localeCompare(b.author);
    }
    return 0;
  });

  // Paginate notes
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = sortedNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(sortedNotes.length / notesPerPage);

  // Generate page numbers
  const generatePageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    if (currentPage > 3) {
      pageNumbers.push('...');
    }

    // Show current page and pages around it
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (pageNumbers.indexOf(i) === -1) {
        pageNumbers.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber !== '...') {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  // Handle sorting change
  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // CRUD operations
  const createNote = () => {
    const newNote = {
      id: notes.length ? Math.max(...notes.map(note => note.id)) + 1 : 1,
      bookTitle: formData.bookTitle,
      author: formData.author,
      content: formData.content
    };

    setNotes([...notes, newNote]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const updateNote = () => {
    if (!currentNote) return;

    const updatedNotes = notes.map(note =>
      note.id === currentNote.id
        ? {
            ...note,
            bookTitle: formData.bookTitle,
            author: formData.author,
            content: formData.content
          }
        : note
    );

    setNotes(updatedNotes);
    setIsEditModalOpen(false);
    resetForm();
  };

  const deleteNote = () => {
    if (!currentNote) return;

    const filteredNotes = notes.filter(note => note.id !== currentNote.id);
    setNotes(filteredNotes);
    setIsDeleteModalOpen(false);
    setCurrentNote(null);
  };

  // Open modal handlers
  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (note) => {
    setCurrentNote(note);
    setFormData({
      bookTitle: note.bookTitle,
      author: note.author,
      content: note.content
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (note) => {
    setCurrentNote(note);
    setIsDeleteModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      bookTitle: '',
      author: '',
      content: ''
    });
    setCurrentNote(null);
  };

  return (
    <>
      <Header />
      <div className="notes-page-container">
        <div className="notes-page-main-content">
          <div className="notes-page-header">
            <h1>My Notes</h1>
            <button
              className="notes-page-btn notes-page-btn-primary"
              onClick={openCreateModal}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Note
            </button>
          </div>

          <div className="notes-page-filter-options">
            <div className="notes-page-search">
              <input
                type="text"
                placeholder="Search by book title..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="notes-page-search-input"
              />
            </div>
            <div className="notes-page-sort-options">
              <span>Sort by:</span>
              <div
                className={`notes-page-filter-option ${sortBy === 'title' ? 'active' : ''}`}
                onClick={() => handleSortChange('title')}
              >
                Book Title
              </div>
              <div
                className={`notes-page-filter-option ${sortBy === 'author' ? 'active' : ''}`}
                onClick={() => handleSortChange('author')}
              >
                Author
              </div>
            </div>
          </div>

          {filteredNotes.length === 0 ? (
            <div className="notes-page-empty-state">
              <p>{notes.length === 0 ? 'No notes found. Create your first note to get started!' : 'No notes match your search.'}</p>
            </div>
          ) : (
            <div className="notes-page-grid">
              {currentNotes.map(note => (
                <div key={note.id} className="notes-page-card">
                  <div className="notes-page-book-title">{note.bookTitle}</div>
                  <div className="notes-page-author">by {note.author}</div>
                  <div className="notes-page-content">
                    {note.content}
                  </div>
                  <div className="notes-page-actions">
                    <div className="notes-page-action-buttons">
                      <button
                        className="notes-page-action"
                        onClick={() => openEditModal(note)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        className="notes-page-action"
                        onClick={() => openDeleteModal(note)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredNotes.length > notesPerPage && (
            <div className="notes-page-pagination">
              {/* Previous page button */}
              <div
                className={`notes-page-page-link ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </div>

              {/* Page numbers */}
              {generatePageNumbers().map((number, index) => (
                <div
                  key={index}
                  className={`notes-page-page-link ${number === currentPage ? 'active' : ''} ${number === '...' ? 'ellipsis' : ''}`}
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </div>
              ))}

              {/* Next page button */}
              <div
                className={`notes-page-page-link ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Note Modal */}
      {isCreateModalOpen && (
        <div className="notes-page-modal-backdrop">
          <div className="notes-page-modal">
            <div className="notes-page-modal-header">
              <h2>Create New Note</h2>
              <button
                className="notes-page-modal-close"
                onClick={() => setIsCreateModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="notes-page-modal-body">
              <div className="notes-page-form-group">
                <label htmlFor="bookTitle">Book Title</label>
                <input
                  type="text"
                  id="bookTitle"
                  name="bookTitle"
                  value={formData.bookTitle}
                  onChange={handleInputChange}
                  className="notes-page-input"
                  placeholder="Enter book title"
                />
              </div>
              <div className="notes-page-form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="notes-page-input"
                  placeholder="Enter author name"
                />
              </div>
              <div className="notes-page-form-group">
                <label htmlFor="content">Note Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="notes-page-textarea"
                  placeholder="Enter your note"
                  rows="6"
                ></textarea>
              </div>
            </div>
            <div className="notes-page-modal-footer">
              <button
                className="notes-page-btn notes-page-btn-secondary"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="notes-page-btn notes-page-btn-primary"
                onClick={createNote}
                disabled={!formData.bookTitle || !formData.content}
              >
                Create Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {isEditModalOpen && (
        <div className="notes-page-modal-backdrop">
          <div className="notes-page-modal">
            <div className="notes-page-modal-header">
              <h2>Edit Note</h2>
              <button
                className="notes-page-modal-close"
                onClick={() => setIsEditModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="notes-page-modal-body">
              <div className="notes-page-form-group">
                <label htmlFor="edit-bookTitle">Book Title</label>
                <input
                  type="text"
                  id="edit-bookTitle"
                  name="bookTitle"
                  value={formData.bookTitle}
                  onChange={handleInputChange}
                  className="notes-page-input"
                />
              </div>
              <div className="notes-page-form-group">
                <label htmlFor="edit-author">Author</label>
                <input
                  type="text"
                  id="edit-author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="notes-page-input"
                />
              </div>
              <div className="notes-page-form-group">
                <label htmlFor="edit-content">Note Content</label>
                <textarea
                  id="edit-content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="notes-page-textarea"
                  rows="6"
                ></textarea>
              </div>
            </div>
            <div className="notes-page-modal-footer">
              <button
                className="notes-page-btn notes-page-btn-secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="notes-page-btn notes-page-btn-primary"
                onClick={updateNote}
                disabled={!formData.bookTitle || !formData.content}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="notes-page-modal-backdrop">
          <div className="notes-page-modal notes-page-modal-sm">
            <div className="notes-page-modal-header">
              <h2>Delete Note</h2>
              <button
                className="notes-page-modal-close"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="notes-page-modal-body">
              <p>Are you sure you want to delete this note for "{currentNote?.bookTitle}"? This action cannot be undone.</p>
            </div>
            <div className="notes-page-modal-footer">
              <button
                className="notes-page-btn notes-page-btn-secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="notes-page-btn notes-page-btn-danger"
                onClick={deleteNote}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default NotesPage;