import { useState } from 'react';
import API from '../api/axios';
import '../assets/globalStyles/modal.css'; // Assuming you have modal styles

function AddBookModal({ showModal, closeModal, lists, onBookAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    completion: '0%',
    listId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const completionOptions = ['0%', '5%', '10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%', '55%', '60%', '65%', '70%', '75%', '80%', '85%', '90%', '95%', '100%'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.listId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await API.post(`/reading-lists/${formData.listId}/books`, {
        title: formData.title,
        author: formData.author,
        completion: formData.completion
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Call the callback function to update the parent component
      if (onBookAdded) {
        onBookAdded(res.data);
      }

      // Reset form and close modal
      setFormData({
        title: '',
        author: '',
        completion: '0%',
        listId: ''
      });
      closeModal();
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.response?.data?.msg || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      author: '',
      completion: '0%',
      listId: ''
    });
    setError('');
    closeModal();
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Book</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter book title"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="completion">Completion</label>
              <select
                id="completion"
                name="completion"
                value={formData.completion}
                onChange={handleInputChange}
                disabled={loading}
              >
                {completionOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="listId">Add to List *</label>
              <select
                id="listId"
                name="listId"
                value={formData.listId}
                onChange={handleInputChange}
                required
                disabled={loading}
              >
                <option value="">Select a list</option>
                {Object.entries(lists).map(([key, list]) => {
                  const listName = key === 'completed'
                    ? 'Recently Completed'
                    : key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                  return (
                    <option key={key} value={list._id}>
                      {listName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formData.title || !formData.author || !formData.listId}
            >
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBookModal;