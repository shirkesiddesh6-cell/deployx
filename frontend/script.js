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

async function createDeployment() {
    const applicationName =
        document.getElementById("applicationName").value;

    const environment =
        document.getElementById("environment").value;

    const deploymentStatus =
        document.getElementById("deploymentStatus").value;

if (!applicationName || !environment || !deploymentStatus) {
    alert("Please fill in all deployment fields.");
    return;
}
    try {
        const response = await fetch("http://localhost:3000/api/deployments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                application_name: applicationName,
                environment: environment,
                status: deploymentStatus
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Deployment created successfully.");

            document.getElementById("applicationName").value = "";
            document.getElementById("environment").value = "";
            document.getElementById("deploymentStatus").value = "";

            loadDeployments();
        } else {
            alert(data.error || "Failed to create deployment.");
        }

    } catch (error) {
        console.error(error);
        alert("Backend connection failed.");
    }
}
