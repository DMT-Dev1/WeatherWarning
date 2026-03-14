// --- Time ---
function updateClock() {
  const now = new Date();
  // Format like 14:05:09
  const formatted = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  const tzName =
    Intl.DateTimeFormat(undefined, { timeZoneName: "long" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "Local Time";

  document.getElementById("clock").textContent = formatted;
  document.getElementById("tz").textContent = tzName;
}

updateClock();
setInterval(updateClock, 1000);

// --- Location ---
const locStatus = document.getElementById("locationStatus");
const locData = document.getElementById("locationData");
const locErr = document.getElementById("locationError");

function showPosition(pos) {
  const { latitude, longitude, accuracy } = pos.coords;
  document.getElementById("lat").textContent = latitude.toFixed(6);
  document.getElementById("lon").textContent = longitude.toFixed(6);
  document.getElementById("acc").textContent = Math.round(accuracy);

  locStatus.textContent = "Permission granted.";
  locData.classList.remove("hidden");
  locErr.classList.add("hidden");
}

function showError(err) {
  locData.classList.add("hidden");
  locErr.classList.remove("hidden");

  switch (err.code) {
    case err.PERMISSION_DENIED:
      locStatus.textContent = "Permission denied.";
      locErr.textContent =
        "We can’t show your location without permission. You can still see your current time.";
      break;
    case err.POSITION_UNAVAILABLE:
      locStatus.textContent = "Location unavailable.";
      locErr.textContent =
        "We couldn’t determine your location. Try checking your network or GPS.";
      break;
    case err.TIMEOUT:
      locStatus.textContent = "Location timed out.";
      locErr.textContent =
        "Getting your position took too long. Please try again.";
      break;
    default:
      locStatus.textContent = "Location error.";
      locErr.textContent = "An unknown error occurred.";
  }
}

// Request location when the page loads
if ("geolocation" in navigator) {
  locStatus.textContent = "Requesting your location…";
  navigator.geolocation.getCurrentPosition(showPosition, showError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  });
} else {
  locStatus.textContent = "Geolocation not supported in this browser.";
}
