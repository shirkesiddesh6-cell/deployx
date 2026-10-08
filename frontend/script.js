async function updateDeployment(id) {
    // ...
}
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
        const response =
            await fetch("http://localhost:3000/api/deployments");

        const data = await response.json();

        const deploymentsDiv =
            document.getElementById("deployments");

        document.getElementById("totalDeployments").textContent =
            data.length;

        const successful =
            data.filter(
                deployment =>
                    deployment.status.trim().toUpperCase() === "SUCCESS"
            ).length;

        const failed =
            data.filter(
                deployment =>
                    deployment.status.trim().toUpperCase() === "FAILED"
            ).length;

        document.getElementById("successfulDeployments").textContent =
            successful;

        document.getElementById("failedDeployments").textContent =
            failed;


        if (data.length === 0) {
            deploymentsDiv.textContent =
                "No deployments found.";

            return;
        }


        deploymentsDiv.innerHTML = data.map(deployment => `

          <div class="deployment-card">

     <h3>${deployment.application_name}</h3>

      <p>
        Environment:
        ${deployment.environment}
    </p>

    <p>
        Current Status:
        <strong class="status-badge ${deployment.status.trim().toLowerCase()}">
            ${deployment.status}
        </strong>
    </p>

    <select id="status-${deployment.id}">
        <option value="RUNNING" ${deployment.status.trim().toUpperCase() === "RUNNING" ? "selected" : ""}>
            RUNNING
        </option>

        <option value="SUCCESS" ${deployment.status.trim().toUpperCase() === "SUCCESS" ? "selected" : ""}>
            SUCCESS
        </option>

        <option value="FAILED" ${deployment.status.trim().toUpperCase() === "FAILED" ? "selected" : ""}>
            FAILED
        </option>
    </select>

    <button onclick="updateDeployment(${deployment.id})">
        Update Status
    </button>

<button onclick="deleteDeployment(${deployment.id})">
    Delete Deployment
</button>

    <p>
        Created:
        ${deployment.created_at}
    </p>

</div>

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


    if (!applicationName ||
        !environment ||
        !deploymentStatus) {

        alert("Please fill in all deployment fields.");

        return;
    }


    try {

        const response =
            await fetch("http://localhost:3000/api/deployments", {

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

            alert(
                data.error ||
                "Failed to create deployment."
            );
        }


    } catch (error) {

        console.error(error);

        alert("Backend connection failed.");
    }
}

async function updateDeployment(id) {
    const status =
        document.getElementById(`status-${id}`).value;

    try {
        const response = await fetch(
            `http://localhost:3000/api/deployments/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: status
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Deployment status updated successfully.");
            loadDeployments();
        } else {
            alert(data.error || "Failed to update deployment.");
        }

    } catch (error) {
        console.error(error);
        alert("Backend connection failed.");
    }
}

async function deleteDeployment(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this deployment?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:3000/api/deployments/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Deployment deleted successfully.");
            loadDeployments();
        } else {
            alert(data.error || "Failed to delete deployment.");
        }

    } catch (error) {
        console.error(error);
        alert("Backend connection failed.");
    }
}
