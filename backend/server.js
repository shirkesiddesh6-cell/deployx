
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "UP",
        message: "DeployX backend is running"
    });
});

// Get platform status
app.get("/api/status", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM platform_status ORDER BY id DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database connection failed"
        });
    }
});

// Create platform status
app.post("/api/status", async (req, res) => {
    try {
        const result = await pool.query(
            "INSERT INTO platform_status (status, message) VALUES ($1, $2) RETURNING *",
            ["UP", "DeployX platform is running"]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to save platform status"
        });
    }
});

// Get all deployments
app.get("/api/deployments", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM deployments ORDER BY id DESC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch deployments"
        });
    }
});

// Create deployment
app.post("/api/deployments", async (req, res) => {
    try {
        const { application_name, environment, status } = req.body;

        if (!application_name || !environment || !status) {
            return res.status(400).json({
                error: "Application name, environment, and status are required"
            });
        }

        const allowedStatuses = ["RUNNING", "SUCCESS", "FAILED"];

        if (
            typeof status !== "string" ||
            !allowedStatuses.includes(status.toUpperCase())
        ) {
            return res.status(400).json({
                error: "Invalid status. Use RUNNING, SUCCESS, or FAILED"
            });
        }

        const result = await pool.query(
            `INSERT INTO deployments
            (application_name, environment, status)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [application_name, environment, status]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create deployment"
        });
    }
});

// Update deployment
app.put("/api/deployments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                error: "Status is required"
            });
        }

        const result = await pool.query(
            `UPDATE deployments
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Deployment not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update deployment"
        });
    }
});

// Delete deployment
app.delete("/api/deployments/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM deployments
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Deployment not found"
            });
        }

        res.json({
            message: "Deployment deleted successfully",
            deployment: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete deployment"
        });
    }
});

// Start the server only when this file is run directly.
// Importing the app for tests will not start another server.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`DeployX backend running on port ${PORT}`);
    });
}

module.exports = app;

