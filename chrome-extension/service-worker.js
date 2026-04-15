const DEFAULTS = {
  enabled: true,
  locked: false,
  user: null,
  sessionUser: null,
  password: "",
  moderationEnabled: true,
  safeLinksOnly: true
};

async function getState() {
  const state = await chrome.storage.local.get(DEFAULTS);
  return { ...DEFAULTS, ...state };
}

async function setState(updates) {
  await chrome.storage.local.set(updates);
}

async function broadcast(message) {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id) continue;
    try {
      await chrome.tabs.sendMessage(tab.id, message);
    } catch (e) {
      // ignore tabs without receiver
    }
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get(null);
  if (Object.keys(current).length === 0) {
    await chrome.storage.local.set(DEFAULTS);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    const state = await getState();

    if (message.type === "GET_STATE") {
      sendResponse({ ok: true, state });
      return;
    }

    if (message.type === "SIGNUP") {
      const { username, email, password } = message;
      if (!username || !email || !password) {
        sendResponse({ ok: false, error: "All fields are required." });
        return;
      }

      const user = { username, email, password };
      await setState({
        user,
        sessionUser: username,
        password,
        locked: false
      });

      await broadcast({ type: "UNLOCK_PAGE" });
      sendResponse({ ok: true });
      return;
    }

    if (message.type === "LOGIN") {
      const { username, password } = message;

      if (!state.user) {
        sendResponse({ ok: false, error: "No account found. Please sign up first." });
        return;
      }

      if (
        username === state.user.username &&
        password === state.user.password
      ) {
        await setState({
          sessionUser: username,
          password,
          locked: false
        });
        await broadcast({ type: "UNLOCK_PAGE" });
        sendResponse({ ok: true });
      } else {
        sendResponse({ ok: false, error: "Invalid username or password." });
      }
      return;
    }

    if (message.type === "LOGOUT") {
      await setState({
        sessionUser: null,
        locked: true
      });
      await broadcast({ type: "LOCK_PAGE" });
      sendResponse({ ok: true });
      return;
    }

    if (message.type === "SET_PASSWORD") {
      if (!message.password) {
        sendResponse({ ok: false, error: "Password cannot be empty." });
        return;
      }

      const updates = { password: message.password };
      if (state.user) {
        updates.user = {
          ...state.user,
          password: message.password
        };
      }

      await setState(updates);
      sendResponse({ ok: true });
      return;
    }

    if (message.type === "SET_ENABLED") {
      await setState({ enabled: !!message.enabled });
      await broadcast({ type: "STATE_UPDATED" });
      sendResponse({ ok: true });
      return;
    }

    if (message.type === "SET_MODERATION") {
      await setState({ moderationEnabled: !!message.enabled });
      await broadcast({ type: "STATE_UPDATED" });
      sendResponse({ ok: true });
      return;
    }

    if (message.type === "SET_SAFE_LINKS") {
      await setState({ safeLinksOnly: !!message.enabled });
      await broadcast({ type: "STATE_UPDATED" });
      sendResponse({ ok: true });
      return;
    }

    if (message.type === "LOCK_ALL") {
      await setState({ locked: true });
      await broadcast({ type: "LOCK_PAGE" });
      sendResponse({ ok: true });
      return;
    }

    if (message.type === "UNLOCK_ALL") {
      if (!state.sessionUser) {
        sendResponse({ ok: false, error: "Please login first." });
        return;
      }

      if ((message.password || "") === state.password) {
        await setState({ locked: false });
        await broadcast({ type: "UNLOCK_PAGE" });
        sendResponse({ ok: true });
      } else {
        sendResponse({ ok: false, error: "Wrong password." });
      }
      return;
    }
  })();

  return true;
});

chrome.tabs.onActivated.addListener(async () => {
  const state = await getState();
  if (!state.enabled || !state.sessionUser) return;

  await setState({ locked: true });
  await broadcast({ type: "LOCK_PAGE" });
});

chrome.windows.onFocusChanged.addListener(async () => {
  const state = await getState();
  if (!state.enabled || !state.sessionUser) return;

  await setState({ locked: true });
  await broadcast({ type: "LOCK_PAGE" });
});