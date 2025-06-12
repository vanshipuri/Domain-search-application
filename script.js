document.getElementById('searchButton').addEventListener('click', function(event) {
    event.preventDefault();
    const domainInput = document.getElementById('domainInput').value.trim();
    const searchResults = document.getElementById('searchResults');
    if (domainInput) {
        // Show loading message
        searchResults.innerHTML = `<span>Loading...</span>`;

        // Build API URL
        const apiKey = '1517a19a32a04cb7b40531a1eb2d9046'; // Replace with your actual API key
        const apiUrl = `https://api.whoisfreaks.com/v1.0/whois?apiKey=${apiKey}&whois=live&domainName=${encodeURIComponent(domainInput)}`;

        fetch(apiUrl, { method: 'GET', redirect: 'follow' })
            .then(response => response.json())
            .then(result => {
                // Display some relevant info from the API response
                if (result.domain_name) {
                    searchResults.innerHTML = `
                        <span><strong>Domain:</strong> ${result.domain_name}</span><br>
                        <span><strong>Status:</strong> ${result.status || 'N/A'}</span><br>
                        <span><strong>Registrar:</strong> ${result.registrar_name || 'N/A'}</span><br>
                        <span><strong>Created:</strong> ${result.creation_date || 'N/A'}</span>
                    `;
                } else {
                    searchResults.innerHTML = `<span>No results found for: ${domainInput}</span>`;
                }
            })
            .catch(error => {
                searchResults.innerHTML = `<span>Error: ${error}</span>`;
            });

        // Show only the latest search in previous searches
        const previousSearches = document.getElementById('previousSearches');
        previousSearches.innerHTML = '';
        const newSearch = document.createElement('span');
        newSearch.textContent = domainInput;
        previousSearches.appendChild(newSearch);
    }
});