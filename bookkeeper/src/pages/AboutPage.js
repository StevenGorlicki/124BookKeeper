import Header from '../reusableItems/Header';
import Footer from '../reusableItems/Footer';
import '../assets/globalStyles/global.css';

function AboutPage() {
  return (
    <>
      <Header />
      <main className="container">
        <h1>About Us</h1>
        <section className="about-content">
          <h2>Our Story</h2>
          <p>Welcome to our website! We are dedicated to providing the best experience for our users.</p>
          
          <h2>Our Mission</h2>
          <p>Our mission is to create innovative solutions that make a difference in people's lives.</p>
          
          <h2>Our Team</h2>
          <p>We are a passionate team of professionals committed to excellence in everything we do.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AboutPage; 