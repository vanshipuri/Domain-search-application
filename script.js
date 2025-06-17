/**
 * Handles the search button press by starting a WHOIS lookup.
 * @param {Event} event - The event object from the button click.
 * @returns {void}
 */
function handleSearchKeyPress(event) {
  event.preventDefault();
  const domainInput = document.getElementById("domainInput").value.trim();
  const searchResults = document.getElementById("searchResults");
  console.log("Button clicked");
  if (domainInput) {
    fetchWhoisData(domainInput);
    appendSearchToHistory(domainInput);
  }
}

function fetchWhoisData(domainInput) {
  // Show loading message
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = `<span>Loading...</span>`;

  // Build API URL
  const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_9Cn3lniJtCJrh4fBKo8bbwLhOqDHt&domainName=${domainInput}&outputFormat=json`;

  return fetch(apiUrl, { method: "GET", redirect: "follow" })
    .then((response) => response.json())
    .then((result) => {
      console.log("API result:", result);

      // Use the appendWhoisDataToDom function to display the data
      appendWhoisDataToDom(result);

      // Extract values from the API response for the not-registered check
      const createdDate = result.WhoisRecord?.createdDate;
      const updatedDate = result.WhoisRecord?.updatedDate;
      const expiresDate = result.WhoisRecord?.expiresDate;
      const registrant = result.WhoisRecord?.registrant;
      const nameServers = result.WhoisRecord?.nameServers?.hostNames;

      // If no whois data is found or the domain is not registered, display a message
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

function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Function to append search results to history
function appendSearchToHistory(domainInput) {
  const historyList = document.getElementById("History");
  // Remove the "No search history yet" message if present
  if (historyList.textContent.includes("No search history yet")) {
    historyList.innerHTML = "";
  }
  // Create a new span for this search
  const historyItem = document.createElement("span");
  historyItem.textContent = domainInput;
  historyItem.classList.add("history-item");
  historyItem.style.display = "inline-block";
  historyItem.style.color = "blue";
  historyItem.style.display = "flex";
  historyItem.style.padding = "5px";
  historyItem.style.border = "1px dotted #ccc";

  historyItem.addEventListener("click", function () {
    loadHistoryItem(domainInput);
  });
  historyList.appendChild(historyItem);
}

function loadHistoryItem(domain) {
  if (domain) {
    document.getElementById("domainInput").value = domain;
    fetchWhoisData(domain);
  }
}

function attachEventListeners() {
  document
    .getElementById("searchButton")
    .addEventListener("click", handleSearchKeyPress);

  document.getElementById("theme").addEventListener("click", toggleTheme);
}

document.addEventListener("DOMContentLoaded", function () {
  attachEventListeners();

  // Check if there is any search history and display a message if not
  const historyList = document.getElementById("History");
  if (historyList.children.length === 0) {
    historyList.innerHTML = "<span>No search history yet</span>";
  }
});
