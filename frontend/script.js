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
