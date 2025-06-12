document.getElementById('searchButton').addEventListener('click', function(event) {
    event.preventDefault();
    const domainInput = document.getElementById('domainInput').value.trim();
    const searchResults = document.getElementById('searchResults');
       console.log("Button clicked");
    if (domainInput) {
        // Show loading message
        searchResults.innerHTML = `<span>Loading...</span>`;

        // Build API URL
        const apiKey = "1517a19a32a04cb7b40531a1eb2d9046"; // Replace with your actual API key
        const apiUrl = `https://api.whoisfreaks.com/v1.0/whois?apiKey=${apiKey}&whois=live&domainName=${encodeURIComponent(domainInput)}`;
        console.log("API URL:", apiUrl);

        // Fetch data from the API
        fetch(apiUrl, { method: 'GET', redirect: 'follow' })
            .then(response => {
                console.log("Raw response:", response);
        return response.json();
    })
    .then(result => {
        console.log("API result:", result);
                // Display some relevant info from the API response
                if (result.domain_name) {
                    searchResults.innerHTML = `
                        <span><strong>Domain Name:</strong> ${result.domain_name}</span><br>
                        <span><strong>Domain Registered:</strong> ${result.domain_registered || 'N/A'}</span><br>
                        <span><strong> Domain Registrar:</strong> ${result.domain_registrar?.email_address || 'N/A'}</span><br>
                        <span><strong> Domain Created:</strong> ${result.create_date || 'N/A'}</span><br>
                       <span><strong> Domain Expiry:</strong> ${result.expiry_date || 'N/A'}</span><br>
                    <span><strong> Domain Updated:</strong> ${result.registry_data.update_date || 'N/A'}</span>
                   
                        `;
                } else {
                    searchResults.innerHTML = `<span>No results found for: ${domainInput}</span>`;
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                searchResults.innerHTML = `<span>Error: ${error}</span>`;
            });

        // Show only the latest search in previous searches
        const previousSearches = document.getElementById('History');
        previousSearches.innerHTML = '';
        const newSearch = document.createElement('span');
        newSearch.textContent = domainInput;
        previousSearches.appendChild(newSearch);
    }
});