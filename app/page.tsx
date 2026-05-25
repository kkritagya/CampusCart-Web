import Image from "next/image";
import Link from "next/link";
import "./page.css";

const categories = ["Textbooks", "Electronics", "Clothing", "Furnitures"];
const testimonials = [
  { emoji: "📚", text: "Great deals on textbooks", author: "Sarah, Junior" },
  { emoji: "🛋️", text: "Helped furnish my dorm easily", author: "Mike, Freshman" },
  { emoji: "💰", text: "Saved 40% on electronics", author: "Alex, Senior" },
];

export default function Home() {
  return (
    <main className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <Link href="/" aria-label="CampusCart home" className="landing-logo-link">
          <Image
            src="/campuscart-logo.png"
            alt="CampusCart"
            width={150}
            height={150}
            className="landing-logo"
            priority
          />
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#categories">Categories</a>
          <a href="#testimonials">Reviews</a>
        </div>

        <div className="nav-actions">
          <Link href="/login" className="nav-login">
            Login
          </Link>
          <Link href="/register" className="nav-register">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="container">
          <div className="hero-content">
            <p className="hero-pill">Student-first campus marketplace</p>
            <h1>Smart deals for campus life</h1>
            <p className="hero-text">
              Buy, sell, rent, or swap with students at your campus. Fast pickups, verified transactions, and prices that make sense for student budgets.
            </p>

            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary">
                Get started free
              </Link>
              <Link href="#features" className="btn btn-secondary">
                See how it works
              </Link>
            </div>

            <div className="hero-stats-grid">
              <div className="stat-item">
                <div className="stat-value">2k+</div>
                <div className="stat-label">Active listings</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">24h</div>
                <div className="stat-label">Avg. pickup time</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">40%</div>
                <div className="stat-label">Avg. savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why choose CampusCart?</h2>
            <p>Built specifically for student needs</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏫</div>
              <h3>Campus-only network</h3>
              <p>Connect with verified students from your college or university</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning-fast pickups</h3>
              <p>Meet nearby for quick, convenient transactions on your schedule</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Smart pricing</h3>
              <p>Student-friendly prices for textbooks, furniture, tech, and more</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Safe & secure</h3>
              <p>Verified campus identities and built-in buyer protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Listings Section */}
      <section className="listings-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular right now</h2>
            <p>See what&apos;s trending on campus</p>
          </div>

          <div className="listing-board">
            <article className="listing-card">
              <div className="listing-image image-book" />
              <h3>Psychology textbook</h3>
              <p className="listing-desc">Used, great condition</p>
              <div className="listing-footer">
                <span>📍 3 min away</span>
                <span className="listing-price">Rs. 2,800</span>
              </div>
            </article>

            <article className="listing-card">
              <div className="listing-image image-fridge" />
              <h3>Mini fridge</h3>
              <p className="listing-desc">Available to rent</p>
              <div className="listing-footer">
                <span>📍 Dorm area</span>
                <span className="listing-price">Rs. 1,200</span>
              </div>
            </article>

            <article className="listing-card">
              <div className="listing-image image-laptop" />
              <h3>USB-C charger</h3>
              <p className="listing-desc">Fast charging</p>
              <div className="listing-footer">
                <span>📍 Library</span>
                <span className="listing-price">Rs. 800</span>
              </div>
            </article>

            <article className="listing-card">
              <div className="listing-image image-chair" />
              <h3>Office chair</h3>
              <p className="listing-desc">Barely used</p>
              <div className="listing-footer">
                <span>📍 5 min away</span>
                <span className="listing-price">Rs. 3,500</span>
              </div>
            </article>
          </div>

          <div className="section-cta">
            <Link href="/register" className="btn btn-primary">
              Browse all listings
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by category</h2>
            <p>Find exactly what you need</p>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <div key={category} className="category-item">
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Loved by students</h2>
            <p>Real reviews from real students</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-emoji">{testimonial.emoji}</div>
                <p className="testimonial-text">{testimonial.text}</p>
                <p className="testimonial-author">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to join CampusCart?</h2>
          <p>Start buying, selling, or renting in minutes</p>
          <div className="cta-buttons">
            <Link href="/register" className="btn btn-primary btn-large">
              Create account
            </Link>
            <Link href="/login" className="btn btn-secondary btn-large">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
