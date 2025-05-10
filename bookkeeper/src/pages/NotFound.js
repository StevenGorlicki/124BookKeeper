function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: "var(--primary)" }}>Go Home</a>
    </div>
  );
}

export default NotFound;
