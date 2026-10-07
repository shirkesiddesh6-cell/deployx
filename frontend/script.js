async function showStatus() {
    try {
        const response = await fetch("http://localhost:3000/api/status");
        const data = await response.json();

        if (data.length > 0) {
            document.getElementById("status").textContent =
                `${data[0].status}: ${data[0].message}`;
        } else {
            document.getElementById("status").textContent =
                "No platform status found.";
        }
    } catch (error) {
        document.getElementById("status").textContent =
            "Backend connection failed.";
        console.error(error);
    }
}

async function loadDeployments() {
    try {
        const response = await fetch("http://localhost:3000/api/deployments");
        const data = await response.json();

        const deploymentsDiv = document.getElementById("deployments");

        if (data.length === 0) {
            deploymentsDiv.textContent = "No deployments found.";
            return;
        }

        deploymentsDiv.innerHTML = data.map(deployment => `
            <div>
                <h3>${deployment.application_name}</h3>
                <p>Environment: ${deployment.environment}</p>
                <p>Status: ${deployment.status}</p>
                <p>Created: ${deployment.created_at}</p>
            </div>
            <hr>
        `).join("");

    } catch (error) {
        document.getElementById("deployments").textContent =
            "Failed to load deployments.";
        console.error(error);
    }
}
