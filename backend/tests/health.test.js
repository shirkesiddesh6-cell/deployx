const request = require("supertest");
const app = require("../server");

describe("DeployX Health API", () => {
    test("GET /api/health returns UP status", async () => {
        const response = await request(app).get("/api/health");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: "UP",
            message: "DeployX backend is running"
        });
    });
});
