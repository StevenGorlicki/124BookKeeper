import Header from '../reusableItems/Header';
import Footer from '../reusableItems/Footer';
import '../assets/globalStyles/global.css';

function Profile() {
  return (
    <>
      <Header />
      <main className="container">
        <h1>Profile Page</h1>
        <p>This is a template for the Profile page.</p>
      </main>
      <Footer />
    </>
  );
}

export default Profile; 