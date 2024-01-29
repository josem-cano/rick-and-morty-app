import supertest from "supertest";
import { createServer } from "../../server";
import { TestHelper } from "../../utils/test-helper";
import datasource from "../../config/datasources/datasource";

describe("Auth routes", () => {
  beforeAll(async () => {
    TestHelper.setupTestDB();

    await datasource.initialize();
  });

  afterAll(async () => {
    TestHelper.teardownTestDB();
    await datasource.destroy();
  });

  const userData = {
    email: "jared@foo.com",
    name: "Jared",
    password: "jared1234",
  };

  it("can register a new user", async () => {
    const app = supertest(createServer());
    const res = await app.post("/auth/register").send(userData);
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();
    expect(res.body.user.id).toBeDefined();
  });

  it("fails if user already registered", async () => {
    const app = supertest(createServer());
    const res = await app.post("/auth/register").send(userData);
    expect(res.status).toBe(409);
  });

  it("fails if register data is missing", async () => {
    const app = supertest(createServer());
    const res = await app
      .post("/auth/register")
      .send({ email: userData.email, name: userData.name });
    expect(res.status).toBe(400);
  });

  it("can login a user", async () => {
    const app = supertest(createServer());
    const res = await app.post("/auth/login").send(userData);
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.token).toBeDefined();
    expect(res.body.user.id).toBeDefined();
  });

  it("fails to login if email does not exist", async () => {
    const app = supertest(createServer());
    const res = await app
      .post("/auth/login")
      .send({ ...userData, email: "foo@foo.com" });
    expect(res.status).toBe(409);
  });

  it("fails to login if email does not exist", async () => {
    const app = supertest(createServer());
    const res = await app
      .post("/auth/login")
      .send({ ...userData, email: "foo@foo.com" });
    expect(res.status).toBe(409);
  });

  it("fails to login if passwords do not match", async () => {
    const app = supertest(createServer());
    const res = await app
      .post("/auth/login")
      .send({ ...userData, password: "1234jared" });
    expect(res.status).toBe(409);
  });

  it("fails to login if data is missing", async () => {
    const app = supertest(createServer());
    const res = await app.post("/auth/login").send({ email: userData.email });
    expect(res.status).toBe(400);
  });
});
