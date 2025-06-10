import React, { useState, useEffect } from 'react';
import Footer from '../reusableItems/Footer';
import Header from '../reusableItems/Header'
import API from '../api/axios';
import './Share.css';

function Share() {
  const [shareType, setShareType] = useState('reading-progress');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedNote, setSelectedNote] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  // State for real data
  const [books, setBooks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load books and notes from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Fetch reading lists to get all books
        const listsRes = await API.get('/reading-lists', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Fetch notes
        const notesRes = await API.get('/notes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Extract all books from all lists
        const allBooks = [];
        listsRes.data.forEach(list => {
          if (list.books && list.books.length > 0) {
            list.books.forEach((book, index) => {
              allBooks.push({
                id: `${list._id}-${index}`, // Unique ID combining list ID and book index
                title: book.title,
                author: book.author,
                progress: book.completion || '0%',
                listId: list._id,
                bookIndex: index,
                listName: list.name
              });
            });
          }
        });

        // Format notes data
        const formattedNotes = notesRes.data.map(note => ({
          id: note._id,
          title: `Note on ${note.bookTitle}`,
          book: note.bookTitle,
          author: note.author,
          content: note.content
        }));

        setBooks(allBooks);
        setNotes(formattedNotes);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load your books and notes');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTypeChange = (type) => {
    setShareType(type);
    setShareLink('');
    setSelectedBook('');
    setSelectedNote('');
    setCopied(false);
  };

  const generateShareLink = () => {
    // In a real app, this would generate an actual link, possibly with an API call
    const baseUrl = 'https://bookkeeper.app/share/';
    let shareableLink = '';

    if (shareType === 'reading-progress' && selectedBook) {
      const book = books.find(b => b.id === selectedBook);
      shareableLink = `${baseUrl}progress/${selectedBook}`;
    } else if (shareType === 'notes' && selectedNote) {
      const note = notes.find(n => n.id === selectedNote);
      shareableLink = `${baseUrl}note/${selectedNote}`;
    }

    setShareLink(shareableLink);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const shareToSocial = (platform) => {
    if (!shareLink) return;

    let shareUrl = '';
    const encodedLink = encodeURIComponent(shareLink);
    let shareText = 'Check out what I\'m reading on BookKeeper!';

    // Customize share text based on what's being shared
    if (shareType === 'reading-progress' && selectedBook) {
      const book = books.find(b => b.id === selectedBook);
      shareText = `I'm ${book.progress} through "${book.title}" by ${book.author}! Check out my reading progress on BookKeeper!`;
    } else if (shareType === 'notes' && selectedNote) {
      const note = notes.find(n => n.id === selectedNote);
      shareText = `Check out my notes on "${note.book}" on BookKeeper!`;
    }

    const encodedText = encodeURIComponent(shareText);

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`;
        break;
      case 'instagram':
        // Instagram doesn't have a web sharing API, so we'd typically just copy to clipboard
        // and instruct the user to paste it in Instagram. For now, we'll just copy to clipboard.
        navigator.clipboard.writeText(`${shareText} ${shareLink}`);
        alert('Text and link copied to clipboard. Open Instagram and paste in your story!');
        return;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedLink}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="share-page">
          <div className="container">
            <div className="loading">Loading your books and notes...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="share-page">
          <div className="container">
            <div className="error">{error}</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="share-page">
        <div className="container">
          <h1 className="page-title">Share Your Reading Journey</h1>

          <div className="share-options">
            <div className="share-type-selector">
              <button
                className={`type-btn ${shareType === 'reading-progress' ? 'active' : ''}`}
                onClick={() => handleTypeChange('reading-progress')}
              >
                Share Reading Progress
              </button>
              <button
                className={`type-btn ${shareType === 'notes' ? 'active' : ''}`}
                onClick={() => handleTypeChange('notes')}
              >
                Share Notes
              </button>
            </div>

          <div className="share-content-selector">
            {shareType === 'reading-progress' ? (
              <div className="form-group">
                <label htmlFor="book-select">Select a book to share:</label>
                {books.length === 0 ? (
                  <p className="no-data-message">No books found in your reading lists. Add some books to your reading lists first!</p>
                ) : (
                  <select
                    id="book-select"
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                  >
                    <option value="">Select a book</option>
                    {books.map(book => (
                      <option key={book.id} value={book.id}>
                        {book.title} by {book.author} - {book.progress} complete ({book.listName})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="note-select">Select a note to share:</label>
                {notes.length === 0 ? (
                  <p className="no-data-message">No notes found. Create some notes first!</p>
                ) : (
                  <select
                    id="note-select"
                    value={selectedNote}
                    onChange={(e) => setSelectedNote(e.target.value)}
                  >
                    <option value="">Select a note</option>
                    {notes.map(note => (
                      <option key={note.id} value={note.id}>
                        {note.title} by {note.author}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <button
              className="generate-link-btn"
              onClick={generateShareLink}
              disabled={
                (shareType === 'reading-progress' && (!selectedBook || books.length === 0)) ||
                (shareType === 'notes' && (!selectedNote || notes.length === 0))
              }
            >
              Generate Shareable Link
            </button>
          </div>

          {shareLink && (
            <div className="share-link-container">
              <h3>Your Shareable Link</h3>
              <div className="share-link-box">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  onClick={(e) => e.target.select()}
                />
                <button
                  className="copy-btn"
                  onClick={copyToClipboard}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="social-share-buttons">
                <h3>Share directly to:</h3>
                <div className="social-buttons">
                  <button
                    className="social-btn facebook"
                    onClick={() => shareToSocial('facebook')}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    Facebook
                  </button>

                  <button
                    className="social-btn twitter"
                    onClick={() => shareToSocial('twitter')}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                    Twitter
                  </button>

                  <button
                    className="social-btn instagram"
                    onClick={() => shareToSocial('instagram')}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    Instagram
                  </button>

                  <button
                    className="social-btn whatsapp"
                    onClick={() => shareToSocial('whatsapp')}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="share-preview">
            {shareType === 'reading-progress' && selectedBook && (
              <div className="preview-container">
                <h3>Preview</h3>
                <div className="preview-card">
                  {books.find(b => b.id === selectedBook) && (
                    <>
                      <div className="preview-book-cover">
                        <div className="book-cover-placeholder">Book</div>
                      </div>
                      <div className="preview-content">
                        <h4>{books.find(b => b.id === selectedBook).title}</h4>
                        <p className="preview-author">by {books.find(b => b.id === selectedBook).author}</p>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{width: books.find(b => b.id === selectedBook).progress}}
                          ></div>
                        </div>
                        <p>I'm {books.find(b => b.id === selectedBook).progress} through this book!</p>
                        <p className="preview-list">From my "{books.find(b => b.id === selectedBook).listName}" list</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {shareType === 'notes' && selectedNote && (
              <div className="preview-container">
                <h3>Preview</h3>
                <div className="preview-card">
                  {notes.find(n => n.id === selectedNote) && (
                    <>
                      <div className="preview-note-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <div className="preview-content">
                        <h4>{notes.find(n => n.id === selectedNote).title}</h4>
                        <p>From: {notes.find(n => n.id === selectedNote).book}</p>
                        <p className="preview-author">by {notes.find(n => n.id === selectedNote).author}</p>
                        <p className="preview-note-text">
                          {notes.find(n => n.id === selectedNote).content.length > 100
                            ? notes.find(n => n.id === selectedNote).content.substring(0, 100) + '...'
                            : notes.find(n => n.id === selectedNote).content
                          }
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Share;