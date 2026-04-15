const showLoginBtn = document.getElementById("showLogin");
const showSignupBtn = document.getElementById("showSignup");
const loginView = document.getElementById("loginView");
const signupView = document.getElementById("signupView");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const signupUsername = document.getElementById("signupUsername");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

const enabledToggle = document.getElementById("enabledToggle");
const moderationToggle = document.getElementById("moderationToggle");
const safeLinksToggle = document.getElementById("safeLinksToggle");
const setPasswordInput = document.getElementById("setPasswordInput");
const savePasswordBtn = document.getElementById("savePasswordBtn");
const lockNowBtn = document.getElementById("lockNowBtn");
const logoutBtn = document.getElementById("logoutBtn");
const statusEl = document.getElementById("status");

function setStatus(text) {
  statusEl.textContent = text;
}

function switchTab(mode) {
  const loginMode = mode === "login";
  showLoginBtn.classList.toggle("active", loginMode);
  showSignupBtn.classList.toggle("active", !loginMode);
  loginView.classList.toggle("active", loginMode);
  signupView.classList.toggle("active", !loginMode);
}

showLoginBtn.addEventListener("click", () => switchTab("login"));
showSignupBtn.addEventListener("click", () => switchTab("signup"));

chrome.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
  if (!response?.ok) return;
  enabledToggle.checked = !!response.state.enabled;
  moderationToggle.checked = !!response.state.moderationEnabled;
  safeLinksToggle.checked = !!response.state.safeLinksOnly;
  setPasswordInput.value = response.state.password || "";
});

loginBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage(
    {
      type: "LOGIN",
      username: loginUsername.value.trim(),
      password: loginPassword.value
    },
    (response) => {
      setStatus(response?.ok ? "Login successful." : response?.error || "Login failed.");
    }
  );
});

signupBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage(
    {
      type: "SIGNUP",
      username: signupUsername.value.trim(),
      email: signupEmail.value.trim(),
      password: signupPassword.value
    },
    (response) => {
      setStatus(response?.ok ? "Account created." : response?.error || "Sign up failed.");
    }
  );
});

enabledToggle.addEventListener("change", () => {
  chrome.runtime.sendMessage(
    { type: "SET_ENABLED", enabled: enabledToggle.checked },
    () => setStatus("Protection updated.")
  );
});

moderationToggle.addEventListener("change", () => {
  chrome.runtime.sendMessage(
    { type: "SET_MODERATION", enabled: moderationToggle.checked },
    () => setStatus("Moderation updated.")
  );
});

safeLinksToggle.addEventListener("change", () => {
  chrome.runtime.sendMessage(
    { type: "SET_SAFE_LINKS", enabled: safeLinksToggle.checked },
    () => setStatus("Safe links updated.")
  );
});

savePasswordBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage(
    { type: "SET_PASSWORD", password: setPasswordInput.value },
    (response) => {
      setStatus(response?.ok ? "Password saved." : response?.error || "Could not save password.");
    }
  );
});

lockNowBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "LOCK_ALL" }, () => {
    setStatus("All protected pages locked.");
  });
});

logoutBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "LOGOUT" }, () => {
    setStatus("Logged out.");
  });
});