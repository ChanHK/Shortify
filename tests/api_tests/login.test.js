import request from "supertest";
import app from "../../index.js";

describe("POST /login", () => {
  it("should return a token when valid credentials are provided", async () => {
    const user = { email: "test@gmail.com", password: "abc123" };
    const response = await request(app).post("/login").send(user);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return an error when invalid credentials are provided", async () => {
    const user = { email: "test@gmail.com", password: "wrongpassword" };
    const response = await request(app).post("/login").send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should return an error when invalid credentials are provided", async () => {
    const user = { email: "invalid@gmail.com", password: "abc123" };
    const response = await request(app).post("/login").send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Account does not exist");
  });

  it("should return an error when no email is provided", async () => {
    const user = { email: "", password: "abc123" };
    const response = await request(app).post("/login").send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email field is required.");
  });

  it("should return an error when wrong email is provided", async () => {
    const user = { email: "wrongemail@abc", password: "abc123" };
    const response = await request(app).post("/login").send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is invalid.");
  });

  it("should return an error when no password is provided", async () => {
    const user = { email: "test@gmail.com", password: "" };
    const response = await request(app).post("/login").send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", " Password field is required.");
  });

  afterAll((done) => {
    app.close(done);
  });
});
