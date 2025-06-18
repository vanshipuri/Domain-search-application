/**
 * Handles the search button press by starting a WHOIS lookup.
 * @param {Event} event - The event object from the button click.
 * @returns {void}
 */
function handleSearchKeyPress(event) {
  event.preventDefault();
  const domainInput = document.getElementById("domainInput").value.trim();
  console.log("Button clicked");
  if (domainInput) {
    fetchWhoisData(domainInput);
    appendSearchToHistory(domainInput);
  }
}

/**
 * Fetches WHOIS data for a given domain and displays it.
 * @param {string} domainInput
 */
function fetchWhoisData(domainInput) {
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = `<span>Loading...</span>`;

  const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_9Cn3lniJtCJrh4fBKo8bbwLhOqDHt&domainName=${domainInput}&outputFormat=json`;

  fetch(apiUrl, { method: "GET", redirect: "follow" })
    .then((response) => response.json())
    .then((result) => {
      console.log("API result:", result);

      appendWhoisDataToDom(result);

      // Check if the domain is not registered
      const createdDate = result.WhoisRecord?.createdDate;
      const updatedDate = result.WhoisRecord?.updatedDate;
      const expiresDate = result.WhoisRecord?.expiresDate;
      const registrant = result.WhoisRecord?.registrant;
      const nameServers = result.WhoisRecord?.nameServers?.hostNames;

      if (
        !createdDate &&
        !updatedDate &&
        !expiresDate &&
        !registrant &&
        !nameServers
      ) {
        searchResults.innerHTML = `<span>This Domain Name is not Registered</span>`;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      searchResults.innerHTML = `<span>Error: ${error}</span>`;
    });
}

/**
 * Appends WHOIS data to the DOM.
 * @param {object} whois
 */
function appendWhoisDataToDom(whois) {
  const searchResults = document.getElementById("searchResults");
  if (!whois.WhoisRecord) {
    searchResults.innerHTML = `<span>No Whois data found for this domain.</span>`;
    return;
  }
  const registrant = whois.WhoisRecord.registrant || {};
  const nameServers = whois.WhoisRecord.nameServers?.hostNames || [];
  searchResults.innerHTML = `
    <strong>Domain Name:</strong> ${whois.WhoisRecord.domainName || "N/A"}<br>
    <strong>Created:</strong> ${whois.WhoisRecord.createdDate || "N/A"}<br>
    <strong>Updated:</strong> ${whois.WhoisRecord.updatedDate || "N/A"}<br>
    <strong>Expires:</strong> ${whois.WhoisRecord.expiresDate || "N/A"}<br>
    <strong>Registrant Name:</strong> ${registrant.name || "N/A"}<br>
    <strong>Registrant Email:</strong> ${registrant.email || "N/A"}<br>
    <strong>Name Servers:</strong> ${nameServers.join(", ") || "N/A"}<br>
  `;
}

/**
 * Toggles dark mode.
 */
function toggleTheme() {
  document.body.classList.toggle("dark");
  // Optional: Change favicon for dark mode
  const favicon = document.getElementById("favicon");
  if (favicon) {
    favicon.href = document.body.classList.contains("dark")
      ? "https://cdn-icons-png.flaticon.com/512/8338/8338708.png"
      : "https://img.icons8.com/?size=100&id=60995&format=png&color=000000";
  }
}

/**
 * Appends a domain to the search history and saves to localStorage.
 * @param {string} domainInput
 * @param {boolean} skipSave - If true, don't save to localStorage (used when loading from storage)
 */
function appendSearchToHistory(domainInput, skipSave) {
  const historyList = document.getElementById("History");
  // Remove the "No search history yet" message if present
  if (historyList.textContent.includes("No search history yet")) {
    historyList.innerHTML = "";
  }
  // Prevent duplicate entries
  if (
    Array.from(historyList.querySelectorAll(".history-item")).some(
      (item) => item.textContent === domainInput
    )
  ) {
    return;
  }
// Create a new span for this search
const historyItem = document.createElement("span");
historyItem.textContent = domainInput;
historyItem.classList.add("history-item");
historyItem.style.display = "block"; // Changed to block for new line
historyItem.style.color = "blue";
historyItem.style.padding = "5px";
historyItem.style.marginBottom = "8px"; // Use marginBottom for vertical spacing
historyItem.addEventListener("click", function () {
    loadHistoryItem(domainInput);
  });
  historyList.appendChild(historyItem);

  // Save to localStorage unless skipSave is true (used when loading from storage)
  if (!skipSave) {
    saveHistoryToLocalStorage();
  }
}

/**
 * Saves the current search history to localStorage.
 */
function saveHistoryToLocalStorage() {
  const historyList = document.getElementById("History");
  const items = Array.from(historyList.querySelectorAll(".history-item")).map(
    (item) => item.textContent
  );
  localStorage.setItem("domainSearchHistory", JSON.stringify(items));
}

/**
 * Loads search history from localStorage (for testing).
 */
function loadHistoryFromLocalStorage() {
  const history = JSON.parse(localStorage.getItem("domainSearchHistory") || "[]");
  const historyList = document.getElementById("History");
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = "<span>No search history yet</span>";
  } else {
    history.forEach((domain) => appendSearchToHistory(domain, true));
  }
}

/**
 * Loads a domain from history into the input and fetches its WHOIS data.
 * @param {string} domain
 */
function loadHistoryItem(domain) {
  if (domain) {
    document.getElementById("domainInput").value = domain;
    fetchWhoisData(domain);
  }
}

/**
 * Attaches event listeners to buttons.
 */
function attachEventListeners() {
  document
    .getElementById("searchButton")
    .addEventListener("click", handleSearchKeyPress);

  document.getElementById("theme").addEventListener("click", toggleTheme);
}

var history= [] ;
var currentResults= null;

document.addEventListener("DOMContentLoaded", function () {
  attachEventListeners();
  // For testing: Uncomment the next line to load history from localStorage
   loadHistoryFromLocalStorage();

  // Show "No search history yet" if empty
  const historyList = document.getElementById("History");
  if (historyList.children.length === 0) {
    historyList.innerHTML = "<span>No search history yet</span>";
  }
});