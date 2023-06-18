import request from "supertest";
import app from "../../index.js";
import account from "../../models/account.js";

describe("Register API", () => {
  it("should register a new user", async () => {
    const user = {
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/register")
      .send(user)
      .expect(200);

    expect(response.body).toHaveProperty("token");

    const { _id } = await account.findOne({ email: user.email });
    expect(_id).toBeDefined();
  });

  it("should return an error when registering with an existing email", async () => {
    const user = {
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/register")
      .send(user)
      .expect(400);

    expect(response.body).toHaveProperty("message", "Email already exists");
  });

  it('should return an error when email field is missing', async () => {
    const user = {
      password: 'password123',
    };

    const response = await request(app)
      .post('/register')
      .send(user)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Email field is required.');
  });

  it('should return an error when email is in invalid format', async () => {
    const user = {
      email: 'invalidemail',
      password: 'password123',
    };

    const response = await request(app)
      .post('/register')
      .send(user)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Email is invalid.');
  });

  it('should return an error when password field is missing', async () => {
    const user = {
      email: 'test@example.com',
    };

    const response = await request(app)
      .post('/register')
      .send(user)
      .expect(400);

    expect(response.body).toHaveProperty('message', ' Password field is required.');
  });

  it('should return an error when password is less than 6 characters', async () => {
    const user = {
      email: 'test@example.com',
      password: 'pass',
    };

    const response = await request(app)
      .post('/register')
      .send(user)
      .expect(400);

    expect(response.body).toHaveProperty(
      'message',
      ' Password must be at least 6, maximum 30 characters.'
    );
  });

  it('should return an error when password is greater than 30 characters', async () => {
    const user = {
      email: 'test@example.com',
      password: 'averylongpasswordgreaterthan30characters',
    };

    const response = await request(app)
      .post('/register')
      .send(user)
      .expect(400);

    expect(response.body).toHaveProperty(
      'message',
      ' Password must be at least 6, maximum 30 characters.'
    );
  });

  afterAll(async () => {
    const user = await account.findOne({ email: "test@example.com" });
    if (user) {
      await account.findByIdAndDelete(user._id);
    }
    app.close();
  });
});
