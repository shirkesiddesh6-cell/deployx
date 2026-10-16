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

    test("GET returns 500 when the database query fails", async () => {
        pool.query.mockRejectedValue(new Error("DB connection failed"));

        const response = await request(app).get("/api/deployments");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Failed to fetch deployments"
        });
    });

    test("POST creates a new deployment", async () => {
        const newDeployment = {
            id: 2,
            application_name: "NewApp",
            environment: "Production",
            status: "RUNNING"
        };

        pool.query.mockResolvedValue({ rows: [newDeployment] });

        const response = await request(app)
            .post("/api/deployments")
            .send({
                application_name: "NewApp",
                environment: "Production",
                status: "RUNNING"
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(newDeployment);
    });

    test("PUT updates an existing deployment", async () => {
        const updated = {
            id: 1,
            application_name: "DeployX-Test",
            environment: "Staging",
            status: "SUCCESS"
        };

        pool.query.mockResolvedValue({ rows: [updated] });

        const response = await request(app)
            .put("/api/deployments/1")
            .send({ environment: "Staging", status: "SUCCESS" });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updated);
    });

    test("DELETE removes a deployment", async () => {
        pool.query.mockResolvedValue({ rows: [{ id: 1 }] });

        const response = await request(app).delete("/api/deployments/1");

        expect(response.status).toBe(200);
    });
});
