import { useState } from 'react';
import Header from '../reusableItems/Header';
import Footer from '../reusableItems/Footer';
import '../assets/globalStyles/global.css';
import './FAQPage.css';

function FAQPage() {
  // State to track expanded FAQ items
  const [expandedItems, setExpandedItems] = useState({});

  // Categories and FAQs
  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking the "Create Account" button on our welcome page. You have the option to sign up using your email address or through your Google account for a quicker registration process.'
        },
        {
          question: 'Is Bookkeeper free to use?',
          answer: 'Yes, Bookkeeper is completely free to use! We offer all features without any subscription fees. In the future, we may introduce premium features, but the core functionality will always remain free.'
        },
        {
          question: 'How do I navigate around Bookkeeper?',
          answer: 'Bookkeeper has a simple navigation bar at the top of every page. You can access your Reading List, Notes, Profile, Community features, Books library, and this FAQ/Help section from any page. Look for the navigation menu at the top of the screen.'
        }
      ]
    },
    {
      id: 'books-reading',
      title: 'Books & Reading Lists',
      faqs: [
        {
          question: 'How do I add a book to my reading list?',
          answer: 'To add a book to your reading list, navigate to the "Books" page and search for the title you want to add. Once you find the book, click the "Add to Reading List" button. You can also specify whether it\'s in your "Currently Reading," "Want to Read," or "Completed" list.'
        },
        {
          question: 'How do I create a custom reading list?',
          answer: 'On the Reading List page, click the "+ Create New List" button in the navigation bar. You\'ll be prompted to enter a name for your new list. After creating it, you can add books to this custom list the same way you would add them to the default lists.'
        }
      ]
    },
    {
      id: 'notes-community',
      title: 'Notes & Community',
      faqs: [
        {
          question: 'How do I create a note?',
          answer: 'To create a note, go to the Notes page and click the "New Note" button. Enter the book title, author name, and your thoughts or observations. Your notes can be organized by book and are easily searchable.'
        },
        {
          question: 'Can I edit or delete my notes?',
          answer: 'Yes, you can edit or delete any note you\'ve created. On the Notes page, find the note you want to modify and click the "Edit" button to make changes. To delete a note, click the "Delete" button and confirm your decision in the popup dialog.'
        },
        {
          question: 'Can I share my reading progress with friends?',
          answer: 'Yes! On your Reading List page, each book has a "Share" option that allows you to share your reading progress or completed books on social media or directly with friends who also use Bookkeeper.'
        }
      ]
    },
    {
      id: 'technical-support',
      title: 'Technical Support',
      faqs: [
        {
          question: 'The app isn\'t loading properly. What should I do?',
          answer: 'First, try refreshing the page. If that doesn\'t work, clear your browser cache and cookies, then restart your browser. If you\'re still experiencing issues, try using a different browser or contact our support team.'
        }
      ]
    }
  ];

  // Toggle FAQ item expansion
  const toggleItem = (categoryId, index) => {
    setExpandedItems(prev => ({
      ...prev,
      [`${categoryId}-${index}`]: !prev[`${categoryId}-${index}`]
    }));
  };

  return (
    <>
      <Header />
      <div className="faq-page-container">
        <div className="faq-page-main-content">
          <h1>Frequently Asked Questions</h1>

          <div className="faq-page-quick-nav">
            <h2>Jump to:</h2>
            <div className="faq-page-category-links">
              {faqCategories.map((category) => (
                <a key={category.id} href={`#${category.id}`} className="faq-page-category-link">
                  {category.title}
                </a>
              ))}
            </div>
          </div>

          <div className="faq-page-content">
            {faqCategories.map((category) => (
              <div key={category.id} className="faq-page-category-section" id={category.id}>
                <h2 className="faq-page-category-title">{category.title}</h2>
                <div className="faq-page-items">
                  {category.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className={`faq-page-item ${expandedItems[`${category.id}-${index}`] ? 'expanded' : ''}`}
                    >
                      <div
                        className="faq-page-question"
                        onClick={() => toggleItem(category.id, index)}
                      >
                        <span>{faq.question}</span>
                        <svg
                          className="faq-page-icon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 9l6 6 6-6"></path>
                        </svg>
                      </div>
                      <div className="faq-page-answer">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="faq-page-contact-support">
            <h2>Still have questions?</h2>
            <p>Our support team is here to help you with any other questions or concerns.</p>
            <button className="faq-page-contact-btn">
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
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              Contact Support
            </button>
            <div className="faq-page-email">
              Or email us at <a href="mailto:support@bookkeeper.com">support@bookkeeper.com</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FAQPage;