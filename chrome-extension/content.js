function detectCookies() {
  const cookies = document.cookie.split(";");

  cookies.forEach(cookie => {
    if (cookie.toLowerCase().includes("track") || cookie.toLowerCase().includes("ads")) {
      console.log("⚠ Suspicious cookie:", cookie);
      alert("Tracking cookie detected!");
    }
  });
}

detectCookies();