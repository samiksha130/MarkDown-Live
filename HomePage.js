import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
// import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">⚡ MarkdownLive</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <a href="/login2.html" className="btn btn-outline-light mx-2">Login</a>
            <a href="/login1.html" className="btn btn-primary">Sign Up</a>
          </div> */}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-primary text-white text-center py-5 animate__animated animate__fadeIn">
        <div className="container">
          <h1 className="display-3 fw-bold">Write in Markdown, See the Magic Instantly! ✨</h1>
          <p className="lead">A powerful Markdown editor for writers, coders, and bloggers.</p>
          <a href="/App" className="btn btn-light btn-lg mt-3 animate__animated animate__pulse animate__infinite">
            Start Writing ✍️
          </a>
          {/* <Link to="/App" className="btn btn-light btn-lg mt-3 animate__animated animate__pulse animate__infinite">
  Go to App
</Link> */}
        </div>
      </header>


      {/* Features Section */}
      <section className="container my-5">
        <div className="row text-center">
          <div className="col-md-4">
            <div className="card p-4 shadow-lg border-0 animate__animated animate__zoomIn">
              <h3>📜 Live Preview</h3>
              <p>See changes instantly while you write.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 shadow-lg border-0 animate__animated animate__zoomIn animate__delay-1s">
              <h3>⚡ Fast & Lightweight</h3>
              <p>No clutter, no lag—just pure Markdown.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 shadow-lg border-0 animate__animated animate__zoomIn animate__delay-2s">
              <h3>☁️ Save and Export</h3>
              <p>Save your work and export it in any format.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4">
        <p>@copyright 2025</p>
        <div className="d-flex justify-content-center">
          <a href="https://github.com/yourrepo" className="text-white mx-2"><i className="fab fa-github fa-2x"></i></a>
          <a href="https://twitter.com/yourhandle" className="text-white mx-2"><i className="fab fa-twitter fa-2x"></i></a>
          <a href="https://linkedin.com/in/yourprofile" className="text-white mx-2"><i className="fab fa-linkedin fa-2x"></i></a>
        </div>
      </footer>
    </div>
  );
};export default HomePage;
