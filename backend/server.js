const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "UP",
        message: "DeployX backend is running"
    });
});

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

app.post("/api/deployments", async (req, res) => {
    try {
        const { application_name, environment, status } = req.body;

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

app.listen(PORT, () => {
    console.log(`DeployX backend running on port ${PORT}`);
});
