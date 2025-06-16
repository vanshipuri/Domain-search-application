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

      
      fetch(apiUrl, { method: "GET", redirect: "follow",  })
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
    <strong>Name Servers:</strong> ${(nameServers || []).join(", ") || "N/A"}<br>
  `;
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          searchResults.innerHTML = `<span>Error: ${error}</span>`;
        });

      // Show only the latest search in previous searches
      const previousSearches = document.getElementById("History");
      previousSearches.innerHTML = "";
      const newSearch = document.createElement("span");
      newSearch.textContent = domainInput;
      previousSearches.appendChild(newSearch);
    }
  });

// for the theme toggle
document.getElementById("theme").addEventListener("click", function () {
  document.body.classList.toggle("dark");
});
