import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedTab, setSelectedTab] = useState("");
  const [unlockedTab, setUnlockedTab] = useState("");
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [redirectLink, setRedirectLink] = useState("");
  const [redirectName, setRedirectName] = useState("");

  const correctPassword = "1234";

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setUnlockedTab("");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const openPrivateTab = (tabName) => {
    setSelectedTab(tabName);
    setPassword("");
    setShowPasswordModal(true);
  };

  const verifyPassword = () => {
    if (password === correctPassword) {
      setUnlockedTab(selectedTab);
      setShowPasswordModal(false);
      setPassword("");
    } else {
      alert("Wrong password. Use 1234 for demo.");
    }
  };

  const closePrivateView = () => {
    setUnlockedTab("");
  };

  const openExternalLink = (name, link) => {
    setRedirectName(name);
    setRedirectLink(link);
    setShowRedirectModal(true);
  };

  const confirmRedirect = () => {
    window.open(redirectLink, "_blank");
    setShowRedirectModal(false);
    setRedirectLink("");
    setRedirectName("");
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo-box">
          <div className="logo-icon">🛡️</div>
          <div>
            <h1>Trust AI Moderator</h1>
            <p>AI-Powered Browser Content Moderator</p>
          </div>
        </div>
        <nav>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#analytics">Analytics</a>
          <a href="#privacy">Private Tabs</a>
          <a href="#links">External Links</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-left">
          <span className="badge">Smart Privacy • Safe Browsing • Better Organization</span>
          <h2>Secure browsing with smart moderation and protected tabs</h2>
          <p>
            A modern website interface for your project with ad detection, harmful link alerts,
            private password-protected tabs, reminders, analytics, and secure external navigation.
          </p>
          <div className="hero-buttons">
            <a href="#features" className="btn primary-btn">Explore Features</a>
            <a href="#privacy" className="btn secondary-btn">Open Private Tabs</a>
          </div>
        </div>

        <div className="hero-right">
          <div className="stat-card">
            <h3>99.2%</h3>
            <p>Ads Removed</p>
          </div>
          <div className="stat-card">
            <h3>120ms</h3>
            <p>Load Time</p>
          </div>
          <div className="stat-card">
            <h3>342</h3>
            <p>Unsafe Links Flagged</p>
          </div>
          <div className="stat-card">
            <h3>98/100</h3>
            <p>Mobile Score</p>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <h2 className="section-title">Core Features</h2>
        <div className="card-grid">
          <div className="feature-card">
            <h3>Ad Detection & Removal</h3>
            <p>Detects spam, popups, and promotional clutter to create a clean browsing experience.</p>
          </div>
          <div className="feature-card">
            <h3>Harmful Link Detection</h3>
            <p>Flags suspicious URLs and helps prevent phishing or insecure navigation.</p>
          </div>
          <div className="feature-card">
            <h3>Smart Categorization</h3>
            <p>Organizes browser content into Study, Hackathon, Personal, Movies, and Others.</p>
          </div>
          <div className="feature-card">
            <h3>Usage-Based Reminders</h3>
            <p>Provides timely reminders based on activity and frequent browsing patterns.</p>
          </div>
          <div className="feature-card">
            <h3>Exclusive Tab Privacy</h3>
            <p>Private content stays blurred and opens only after password verification.</p>
          </div>
          <div className="feature-card">
            <h3>Safe External Navigation</h3>
            <p>External links never open directly. A confirmation box appears first.</p>
          </div>
        </div>
      </section>

      <section className="section analytics-section" id="analytics">
        <h2 className="section-title">Smart Analytics</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Activity Overview</h3>

            <div className="bar-item">
              <div className="bar-label">
                <span>Study</span>
                <span>88%</span>
              </div>
              <div className="bar-bg"><div className="bar-fill fill-88"></div></div>
            </div>

            <div className="bar-item">
              <div className="bar-label">
                <span>Hackathon</span>
                <span>76%</span>
              </div>
              <div className="bar-bg"><div className="bar-fill fill-76"></div></div>
            </div>

            <div className="bar-item">
              <div className="bar-label">
                <span>Personal</span>
                <span>64%</span>
              </div>
              <div className="bar-bg"><div className="bar-fill fill-64"></div></div>
            </div>

            <div className="bar-item">
              <div className="bar-label">
                <span>Movies</span>
                <span>38%</span>
              </div>
              <div className="bar-bg"><div className="bar-fill fill-38"></div></div>
            </div>
          </div>

          <div className="analytics-card">
            <h3>AI Suggestions</h3>
            <div className="suggestion-box">
              <strong>Reminder</strong>
              <p>You usually study at 8 PM. Continue your learning today.</p>
            </div>
            <div className="suggestion-box">
              <strong>Privacy Alert</strong>
              <p>Private content will auto-lock when the tab loses focus.</p>
            </div>
            <div className="suggestion-box">
              <strong>Safety Alert</strong>
              <p>Suspicious external links require confirmation before opening.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="privacy">
        <h2 className="section-title">Private Tabs</h2>
        <div className="card-grid">
          <div className="private-card">
            <h3>Personal Workspace 🔒</h3>
            <div className={`private-content ${unlockedTab === "personal" ? "unlocked" : "locked"}`}>
              <p>Private notes, personal browsing activity, and confidential content.</p>
            </div>
            <div className="private-actions">
              <button className="btn primary-btn" onClick={() => openPrivateTab("personal")}>
                Unlock Tab
              </button>
              {unlockedTab === "personal" && (
                <button className="btn secondary-btn" onClick={closePrivateView}>
                  Lock Again
                </button>
              )}
            </div>
          </div>

          <div className="private-card">
            <h3>Study Vault 🔒</h3>
            <div className={`private-content ${unlockedTab === "study" ? "unlocked" : "locked"}`}>
              <p>Exam schedules, learning plans, deadlines, and saved study resources.</p>
            </div>
            <div className="private-actions">
              <button className="btn primary-btn" onClick={() => openPrivateTab("study")}>
                Unlock Tab
              </button>
              {unlockedTab === "study" && (
                <button className="btn secondary-btn" onClick={closePrivateView}>
                  Lock Again
                </button>
              )}
            </div>
          </div>

          <div className="private-card">
            <h3>Hackathon Strategy 🔒</h3>
            <div className={`private-content ${unlockedTab === "hackathon" ? "unlocked" : "locked"}`}>
              <p>Project ideas, pitch notes, deployment plans, and judge preparation content.</p>
            </div>
            <div className="private-actions">
              <button className="btn primary-btn" onClick={() => openPrivateTab("hackathon")}>
                Unlock Tab
              </button>
              {unlockedTab === "hackathon" && (
                <button className="btn secondary-btn" onClick={closePrivateView}>
                  Lock Again
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="links">
        <h2 className="section-title">External Links</h2>
        <div className="card-grid">
          <div className="feature-card">
            <h3>GitHub Repository</h3>
            <p>Open your project code safely with redirect confirmation.</p>
            <button
              className="btn primary-btn"
              onClick={() =>
                openExternalLink("GitHub Repository", "https://github.com/madhusri829/ai-browser-moderator")
              }
            >
              Open Safely
            </button>
          </div>

          <div className="feature-card">
            <h3>Live Demo</h3>
            <p>Open your deployed website only after confirmation.</p>
            <button
              className="btn primary-btn"
              onClick={() =>
                openExternalLink("Live Demo", "https://ai-browser-moderator.vercel.app/")
              }
            >
              Open Safely
            </button>
          </div>

          <div className="feature-card">
            <h3>Vercel</h3>
            <p>Go to deployment dashboard through a protected redirect step.</p>
            <button
              className="btn primary-btn"
              onClick={() => openExternalLink("Vercel", "https://vercel.com/")}
            >
              Open Safely
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <h3>Trust AI Moderator</h3>
        <p>AI-powered secure browsing, privacy-aware protection, and smart organization.</p>
      </footer>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Unlock Private Tab</h3>
            <p>Enter password to view this protected content.</p>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="demo-text">Demo password: 1234</p>
            <div className="modal-buttons">
              <button className="btn primary-btn" onClick={verifyPassword}>
                Unlock
              </button>
              <button className="btn secondary-btn" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showRedirectModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Leave Platform?</h3>
            <p>
              You are about to open <strong>{redirectName}</strong> on another platform.
            </p>
            <p className="warning-text">
              This website does not directly jump to external platforms.
            </p>
            <div className="modal-buttons">
              <button className="btn primary-btn" onClick={confirmRedirect}>
                Continue
              </button>
              <button className="btn secondary-btn" onClick={() => setShowRedirectModal(false)}>
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;