
const request = require("supertest");
const app = require("../server");

describe("DeployX Deployments API validation", () => {
    test("POST rejects a request with missing fields", async () => {
        const response = await request(app)
            .post("/api/deployments")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "Application name, environment, and status are required"
        });
    });

    test("POST rejects an invalid deployment status", async () => {
        const response = await request(app)
            .post("/api/deployments")
            .send({
                application_name: "DeployX-Test",
                environment: "Development",
                status: "UNKNOWN"
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            "Invalid status. Use RUNNING, SUCCESS, or FAILED"
        );
    });

    test("PUT rejects a request without a status", async () => {
        const response = await request(app)
            .put("/api/deployments/999999")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "Status is required"
        });
    });
});
