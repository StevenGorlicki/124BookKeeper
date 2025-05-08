import Header from '../reusableItems/Header';
import Footer from '../reusableItems/Footer';
import '../assets/globalStyles/global.css';

function ExamplePage() {
  return (
    <>
      <Header />
      <main className="container">
        <h1> This is an Example Page </h1>
        <p>Page content goes here...</p>
      </main>
      <Footer />
    </>
  );
}

export default ExamplePage;
