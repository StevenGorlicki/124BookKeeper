import Header from '../reusableItems/Header';
import Footer from '../reusableItems/Footer';
import '../assets/globalStyles/global.css';

function Books() {
  return (
    <>
      <Header />
      <main className="container">
        <h1>Books Page</h1>
        <p>This is a template for the Books page.</p>
      </main>
      <Footer />
    </>
  );
}

export default Books; 