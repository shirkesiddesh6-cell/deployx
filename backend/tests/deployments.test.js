
jest.mock("../db", () => ({
    query: jest.fn()
}));

const request = require("supertest");
const pool = require("../db");
const app = require("../server");

describe("DeployX Deployments API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("GET returns deployments from the database", async () => {
        const mockDeployments = [
            {
                id: 1,
                application_name: "DeployX-Test",
                environment: "Development",
                status: "SUCCESS"
            }
        ];

        pool.query.mockResolvedValue({ rows: mockDeployments });

        const response = await request(app).get("/api/deployments");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockDeployments);
        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM deployments ORDER BY id DESC"
        );
    });

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
