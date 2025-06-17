document
  .getElementById("searchButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const domainInput = document.getElementById("domainInput").value.trim();
    const searchResults = document.getElementById("searchResults");
    console.log("Button clicked");
    if (domainInput) {
      // Show loading message

      searchResults.innerHTML = `<span>Loading...</span>`;

      // Build API URL
      const apiKey = "at_9Cn3lniJtCJrh4fBKo8bbwLhOqDHt";
      const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_9Cn3lniJtCJrh4fBKo8bbwLhOqDHt&domainName=${domainInput}&outputFormat=json
     `;
      console.log("API URL:", apiUrl);

      fetch(apiUrl, { method: "GET", redirect: "follow" })
        .then((response) => response.json())

        .then((result) => {
          console.log("API result:", result);

          // Extract values from the API response
          const domainName = result.WhoisRecord?.domainName;
          const createdDate = result.WhoisRecord?.createdDate;
          const updatedDate = result.WhoisRecord?.updatedDate;
          const expiresDate = result.WhoisRecord?.expiresDate;
          const registrant = result.WhoisRecord?.registrant;
          const nameServers = result.WhoisRecord?.nameServers?.hostNames;

          searchResults.innerHTML = `
    <strong>Domain Name:</strong> ${domainName || "N/A"}<br>
    <strong>Created:</strong> ${createdDate || "N/A"}<br>
    <strong>Updated:</strong> ${updatedDate || "N/A"}<br>
    <strong>Expires:</strong> ${expiresDate || "N/A"}<br>
    <strong>Registrant Name:</strong> ${registrant?.name || "N/A"}<br>
    <strong>Registrant Email:</strong> ${registrant?.email || "N/A"}<br>
    <strong>Name Servers:</strong> ${
      (nameServers || []).join(", ") || "N/A"
    }<br>
  `;
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          searchResults.innerHTML = `<span>Error: ${error}</span>`;
        });

        //Show all the searches in previous searches
        

      // Show only the latest search in previous searches
      //const previousSearches = document.getElementById("History");
      //previousSearches.innerHTML = "";
      //const newSearch = document.createElement("span");
      //newSearch.textContent = domainInput;
      //previousSearches.appendChild(newSearch);

      // Add all previous searches to history
      appendSearchToHistory();
    }
  });

function toggleTheme() {
  document.body.classList.toggle("dark");
}
document.getElementById("theme").addEventListener("click", toggleTheme);

function fetchWhoisData(domain) {
  fetch(
    `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_9Cn3lniJtCJrh4fBKo8bbwLhOqDHt&domainName=${domain}&outputFormat=json`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Whois data:", data);
      appendWhoisDataToDom(data);
    })
    .catch((error) => {
      console.error("Error fetching Whois data:", error);
      document.getElementById(
        "searchResults"
      ).innerHTML = `<span>Error: ${error.message}</span>`;
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


// Function to append search results to history
  function appendSearchToHistory() {
  const domainInput = document.getElementById("domainInput").value.trim();
  if (domainInput) {
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
}

function loadHistoryItem(domain) {
  if (domain) {
    document.getElementById("domainInput").value = domain;
    fetchWhoisData(domain);
  }
}
