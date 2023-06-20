import request from "supertest";
import server from "../../index.js";
import account from "../../models/account.js";

describe("/POST /shorten", () => {
  var token = null;
  it("should register a user and return a token", async () => {
    const userData = {
      email: "test1@example.com",
      password: "password123",
    };

    const response = await request(server)
      .post("/register")
      .send(userData)
      .expect(200);

    token = response.body.token;
    expect(token).toBeDefined();
  });

  it("should return an error when originalUrl field is missing", async () => {
    const data = {
      customCode: "abc123",
      expiration: "2023-06-30",
    };

    const response = await request(server)
      .post("/shorten")
      .send(data)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    expect(response.body).toHaveProperty(
      "message",
      " Original URL field is required."
    );
  });

    it("should return an error when originalUrl is in an invalid format", async () => {
      const data = {
        originalUrl: "notvalidurl",
        customCode: "abc123",
        expiration: "2023-06-30",
      };

      const response = await request(server)
        .post("/shorten")
        .send(data)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(response.body).toHaveProperty("message", " Invalid URL format.");
    });

    it("should return an error when customCode length is invalid", async () => {
      const data = {
        originalUrl: "https://example.com",
        customCode: "abc12345678",
        expiration: "2023-06-30",
      };

      const response = await request(server)
        .post("/shorten")
        .send(data)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(response.body).toHaveProperty(
        "message",
        " Custom code must be between 1 and 10 characters."
      );
    });

    it("should return an error when expiration date is not greater than today", async () => {
      const data = {
        originalUrl: "https://example.com",
        customCode: "abc123",
        expiration: "2022-06-30",
      };

      const response = await request(server)
        .post("/shorten")
        .send(data)
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(response.body).toHaveProperty(
        "message",
        " Expiration date must be greater than today."
      );
    });

  afterAll(async () => {
    await account.findOneAndDelete({ email: "test1@example.com" });

    // Delete any other created data as needed
    // ...

    // Close the app
    server.close();
  });
});
