import Header from '../reusableItems/Header';
import Footer from '../reusableItems/Footer';
import '../assets/globalStyles/global.css';
import './AboutPage.css';

function AboutPage() {
  return (
    <>
      <Header />
      <main className="container">
        <h1>About Us</h1>
        <section className="about-content">
          <h2>Our Story</h2>
          <p>
            Welcome to our website! We are dedicated to providing the best
            experience for our users.
          </p>

          <h2>Our Mission</h2>
          <p>
            We developed BookKeeper to help fellow readers connect over shared reading interests and organically
            develop social communities to debate and discuss books in a friendly and collegial manner!
          </p>

          <h2>Our Team</h2>
          <p>
            We're a group of three students: Chris Cheng, Quincy Stokes, and Steven
            Gorlicki. We're INF 191 Capstone project group members that are
            passionate about game development and reading.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default AboutPage;
