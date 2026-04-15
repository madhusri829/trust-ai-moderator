import { useEffect, useState } from "react";
import "./App.css";

function classifyContent(text, url) {
  const lower = `${text} ${url}`.toLowerCase();

  if (
    lower.includes("study") ||
    lower.includes("course") ||
    lower.includes("learn") ||
    lower.includes("education")
  ) {
    return "Study";
  }

  if (
    lower.includes("hackathon") ||
    lower.includes("devpost") ||
    lower.includes("challenge") ||
    lower.includes("project")
  ) {
    return "Hackathon";
  }

  if (
    lower.includes("movie") ||
    lower.includes("netflix") ||
    lower.includes("trailer") ||
    lower.includes("music")
  ) {
    return "Movies";
  }

  if (
    lower.includes("free") ||
    lower.includes("offer") ||
    lower.includes("click") ||
    lower.includes("reward") ||
    lower.includes("urgent")
  ) {
    return "Spam";
  }

  if (
    lower.includes("profile") ||
    lower.includes("account") ||
    lower.includes("password") ||
    lower.includes("personal")
  ) {
    return "Personal";
  }

  return "Others";
}

function smartScheduleMessage() {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) return "Good morning! Time to study 📚";
  if (hour >= 12 && hour < 18) return "Keep working! You're doing great 💻";
  if (hour >= 18 && hour < 23) return "Relax or continue learning smartly 🎬";
  return "Time to rest 😴";
}

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [storedUser, setStoredUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [siteLocked, setSiteLocked] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [privateUnlocked, setPrivateUnlocked] = useState(false);

  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [redirectName, setRedirectName] = useState("");
  const [redirectLink, setRedirectLink] = useState("");

  const [sampleTitle, setSampleTitle] = useState("Click here for free rewards");
  const [sampleUrl, setSampleUrl] = useState("http://spam-site.com");
  const [classificationResult, setClassificationResult] = useState("");
  const [scheduleMessage, setScheduleMessage] = useState("");

  const [cookieWarnings, setCookieWarnings] = useState([]);
  const [reminderEmail, setReminderEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const lockSiteNow = () => {
    localStorage.setItem("site_locked", "true");
    setSiteLocked(true);
    setPrivateUnlocked(false);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("trust_user");
    const savedSession = localStorage.getItem("trust_session");
    const savedLock = localStorage.getItem("site_locked");

    if (savedUser) {
      setStoredUser(JSON.parse(savedUser));
    }

    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setLoggedInUser(parsedSession);
      setReminderEmail(parsedSession.email || "");
      setActivePage("dashboard");
    }

    if (savedLock === "true") {
      setSiteLocked(true);
    }

    setScheduleMessage(smartScheduleMessage());

    const detectedCookies = document.cookie
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .filter(
        (cookie) =>
          cookie.toLowerCase().includes("track") ||
          cookie.toLowerCase().includes("ads") ||
          cookie.toLowerCase().includes("analytics")
      );

    setCookieWarnings(detectedCookies);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lockSiteNow();
      }
    };

    const handleBlur = () => {
      lockSiteNow();
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();

    const { username, email, password } = signupData;
    if (!username || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    const newUser = { username, email, password };
    localStorage.setItem("trust_user", JSON.stringify(newUser));
    setStoredUser(newUser);

    alert("Account created successfully. Please login.");
    setActivePage("login");
    setSignupData({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!storedUser) {
      alert("No account found. Please sign up first.");
      return;
    }

    if (
      loginData.username === storedUser.username &&
      loginData.password === storedUser.password
    ) {
      setLoggedInUser(storedUser);
      setReminderEmail(storedUser.email);
      localStorage.setItem("trust_session", JSON.stringify(storedUser));
      localStorage.removeItem("site_locked");
      setSiteLocked(false);
      setUnlockPassword("");
      setActivePage("dashboard");
      alert("Login successful.");
    } else {
      alert("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("trust_session");
    localStorage.removeItem("site_locked");
    setLoggedInUser(null);
    setSiteLocked(false);
    setPrivateUnlocked(false);
    setUnlockPassword("");
    setActivePage("home");
  };

  const unlockSite = () => {
    if (!loggedInUser) {
      localStorage.removeItem("site_locked");
      setSiteLocked(false);
      setUnlockPassword("");
      setActivePage("login");
      alert("Session expired. Please login again.");
      return;
    }

    if (unlockPassword === loggedInUser.password) {
      localStorage.removeItem("site_locked");
      setSiteLocked(false);
      setUnlockPassword("");
    } else {
      alert("Wrong password.");
    }
  };

  const unlockPrivateContent = () => {
    if (!loggedInUser) {
      alert("Please login first.");
      setActivePage("login");
      return;
    }

    if (unlockPassword === loggedInUser.password) {
      setPrivateUnlocked(true);
      setUnlockPassword("");
    } else {
      alert("Wrong password.");
    }
  };

  const openExternalLink = (name, link) => {
    setRedirectName(name);
    setRedirectLink(link);
    setShowRedirectModal(true);
  };

  const confirmRedirect = async () => {
    try {
      await navigator.clipboard.writeText(redirectLink);
      alert("Link copied. Paste it manually in browser.");
    } catch (error) {
      alert("Could not copy link.");
    }

    setShowRedirectModal(false);
    setRedirectName("");
    setRedirectLink("");
  };

  const runClassification = () => {
    const result = classifyContent(sampleTitle, sampleUrl);
    setClassificationResult(result);

    const usage = JSON.parse(localStorage.getItem("usage")) || {};
    usage[result] = (usage[result] || 0) + 1;
    localStorage.setItem("usage", JSON.stringify(usage));
  };

  const sendReminderEmail = async () => {
    if (!reminderEmail) {
      setEmailStatus("Please enter an email.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: reminderEmail,
          message: "Reminder: Continue your work today with Trust AI Moderator.",
        }),
      });

      const text = await response.text();
      setEmailStatus(text);
    } catch (error) {
      setEmailStatus("Error sending email.");
    }
  };

  const usageData = JSON.parse(localStorage.getItem("usage")) || {};

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
          <button onClick={() => setActivePage("home")}>Home</button>
          <button onClick={() => setActivePage("features")}>Features</button>
          <button onClick={() => setActivePage("implementation")}>Implementation</button>
          {!loggedInUser && <button onClick={() => setActivePage("login")}>Login</button>}
          {!loggedInUser && <button onClick={() => setActivePage("signup")}>Sign Up</button>}
          {loggedInUser && <button onClick={() => setActivePage("dashboard")}>Dashboard</button>}
          {loggedInUser && <button onClick={handleLogout}>Logout</button>}
        </nav>
      </header>

      {activePage === "home" && (
        <section className="hero">
          <div className="hero-content">
            <div className="hero-left">
              <span className="badge">AI Privacy • Safe Browsing • Smart Protection</span>
              <h2>Trust AI Moderator</h2>
              <p>
                Protect browsing privacy, detect unsafe links, secure private tabs,
                detect cookies, and prevent jumping to other platforms without user click.
              </p>

              <div className="hero-buttons">
                <button className="btn primary-btn" onClick={() => setActivePage("features")}>
                  Explore Features
                </button>
                {!loggedInUser && (
                  <button className="btn secondary-btn" onClick={() => setActivePage("signup")}>
                    Create Account
                  </button>
                )}
              </div>
            </div>

            <div className="hero-right">
              <img src="/front.webp" alt="Trust AI Moderator" className="hero-image" />
            </div>
          </div>
        </section>
      )}

      {activePage === "features" && (
        <section className="section">
          <h2 className="section-title">Core Features</h2>

          <div className="card-grid">
            <div className="feature-card">
              <h3>Ad Detection & Removal</h3>
              <p>Highlights spammy and ad-like content for a cleaner browsing experience.</p>
            </div>

            <div className="feature-card">
              <h3>Harmful Link Detection</h3>
              <p>Warns users about insecure and suspicious links.</p>
            </div>

            <div className="feature-card">
              <h3>Private Tab Protection</h3>
              <p>Locks sensitive content and requires the user's own password to unlock.</p>
            </div>

            <div className="feature-card">
              <h3>Cookie Detection</h3>
              <p>Detects suspicious tracking and analytics cookie names.</p>
            </div>

            <div className="feature-card">
              <h3>Email Reminders</h3>
              <p>Sends reminder emails through the backend server.</p>
            </div>

            <div className="feature-card">
              <h3>Smart Scheduling</h3>
              <p>Shows dynamic reminders based on current time.</p>
            </div>
          </div>
        </section>
      )}

      {activePage === "implementation" && (
  <section className="section">
    <h2 className="section-title">Implementation</h2>

    <div className="image-grid">
      <div className="image-card">
        <h3>Future of Moderation</h3>
        <p>
          AI helps improve safety, relevance, and content quality in modern digital platforms.
        </p>
      </div>

      <div className="image-card">
        <h3>Tools & Methods</h3>
        <p>
          Uses privacy locks, content warnings, cookie detection, and controlled navigation.
        </p>
      </div>
    </div>
  </section>
)}

      {activePage === "signup" && (
        <section className="form-section">
          <div className="form-card">
            <h2>Create Account</h2>
            <p className="form-subtitle">Create your own username and password</p>

            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Username"
                value={signupData.username}
                onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
              />

              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              />

              <input
                type="password"
                placeholder="Create Password"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              />

              <button type="submit" className="btn primary-btn full-btn">
                Sign Up
              </button>
            </form>
          </div>
        </section>
      )}

      {activePage === "login" && (
        <section className="form-section">
          <div className="form-card">
            <h2>Login</h2>
            <p className="form-subtitle">Use your own account password</p>

            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />

              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />

              <button type="submit" className="btn primary-btn full-btn">
                Login
              </button>
            </form>
          </div>
        </section>
      )}

      {activePage === "dashboard" && loggedInUser && (
        <section className="section">
          <h2 className="section-title">Welcome, {loggedInUser.username}</h2>

          <div className="dashboard-grid">
            <div className="feature-card">
              <h3>User Information</h3>
              <p><strong>Username:</strong> {loggedInUser.username}</p>
              <p><strong>Email:</strong> {loggedInUser.email}</p>
              <p><strong>Schedule:</strong> {scheduleMessage}</p>
            </div>

            <div className="feature-card">
              <h3>Private Content</h3>
              {!privateUnlocked ? (
                <>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                  />
                  <button className="btn primary-btn full-btn" onClick={unlockPrivateContent}>
                    Unlock Private Area
                  </button>
                </>
              ) : (
                <div className="private-box">
                  <p>
                    Private browser protection settings, secure notes, and moderation tools are now visible.
                  </p>
                </div>
              )}
            </div>

            <div className="feature-card">
              <h3>Safe External Access</h3>
              <button
                className="btn primary-btn full-btn"
                onClick={() =>
                  openExternalLink(
                    "GitHub Repository",
                    "https://github.com/madhusri829/trust-ai-moderator"
                  )
                }
              >
                Copy GitHub Link
              </button>
            </div>

            <div className="feature-card">
              <h3>AI Classification</h3>
              <input
                type="text"
                placeholder="Enter page title"
                value={sampleTitle}
                onChange={(e) => setSampleTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter URL"
                value={sampleUrl}
                onChange={(e) => setSampleUrl(e.target.value)}
              />
              <button className="btn primary-btn full-btn" onClick={runClassification}>
                Classify Content
              </button>
              {classificationResult && (
                <p className="result-text"><strong>Category:</strong> {classificationResult}</p>
              )}
            </div>

            <div className="feature-card">
              <h3>Cookie Detection</h3>
              {cookieWarnings.length > 0 ? (
                <div className="private-box">
                  {cookieWarnings.map((cookie, index) => (
                    <p key={index}>⚠ {cookie}</p>
                  ))}
                </div>
              ) : (
                <p>No suspicious cookies detected.</p>
              )}
            </div>

            <div className="feature-card">
              <h3>Email Reminder</h3>
              <input
                type="email"
                placeholder="Enter reminder email"
                value={reminderEmail}
                onChange={(e) => setReminderEmail(e.target.value)}
              />
              <button className="btn primary-btn full-btn" onClick={sendReminderEmail}>
                Send Reminder
              </button>
              {emailStatus && <p className="result-text">{emailStatus}</p>}
            </div>

            <div className="feature-card">
              <h3>Usage Tracking</h3>
              <p>Study: {usageData.Study || 0}</p>
              <p>Hackathon: {usageData.Hackathon || 0}</p>
              <p>Movies: {usageData.Movies || 0}</p>
              <p>Spam: {usageData.Spam || 0}</p>
              <p>Personal: {usageData.Personal || 0}</p>
              <p>Others: {usageData.Others || 0}</p>
            </div>
          </div>
        </section>
      )}

      {showRedirectModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Leave Platform?</h3>
            <p>
              You are about to access <strong>{redirectName}</strong>.
            </p>
            <p className="warning-text">
              This website does not directly open external platforms. The link will be copied instead.
            </p>

            <div className="modal-buttons">
              <button className="btn primary-btn" onClick={confirmRedirect}>
                Copy Link
              </button>
              <button className="btn secondary-btn" onClick={() => setShowRedirectModal(false)}>
                Stay Here
              </button>
            </div>
          </div>
        </div>
      )}

      {siteLocked && (
        <div className="site-lock-overlay">
          <div className="site-lock-box">
            <h2>Site Locked</h2>

            {!loggedInUser ? (
              <>
                <p>Your session is not active. Please login again.</p>
                <button
                  className="btn primary-btn full-btn"
                  onClick={() => {
                    localStorage.removeItem("site_locked");
                    setSiteLocked(false);
                    setActivePage("login");
                  }}
                >
                  Go to Login
                </button>
              </>
            ) : (
              <>
                <p>This website was locked because you switched tab, window, or app.</p>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                />

                <button className="btn primary-btn full-btn" onClick={unlockSite}>
                  Unlock Site
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}