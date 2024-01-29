import supertest from "supertest";
import { createServer } from "../../server";
import { TestHelper } from "../../utils/test-helper";
import datasource from "../../config/datasources/datasource";
import { generateJwt } from "../../services/auth-service";

describe("Characters routes", () => {
  beforeAll(async () => {
    TestHelper.setupTestDB();
    await datasource.initialize();
  });

  afterAll(async () => {
    TestHelper.teardownTestDB();
    await datasource.destroy();
  });

  it("requires token", async () => {
    const app = supertest(createServer());
    const res = await app.get("/characters");
    expect(res.status).toBe(401);
  });

  it("can get characters", async () => {
    const app = supertest(createServer());
    const user = await TestHelper.getOrCreateUser();
    const token = generateJwt(user);
    const res = await app
      .get("/characters?page=1")
      .auth(token, { type: "bearer" });
    expect(res.status).toBe(200);
    expect(res.body.characters.length).toBe(20);
  });

  it("can get single character", async () => {
    const app = supertest(createServer());
    const user = await TestHelper.getOrCreateUser();
    const token = generateJwt(user);
    const res = await app.get("/characters/1").auth(token, { type: "bearer" });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it("returns error if character does not exist", async () => {
    const app = supertest(createServer());
    const user = await TestHelper.getOrCreateUser();
    const token = generateJwt(user);
    const res = await app
      .get("/characters/12345")
      .auth(token, { type: "bearer" });
    expect(res.status).toBe(404);
  });

  it("can fav a character", async () => {
    const app = supertest(createServer());
    const user = await TestHelper.getOrCreateUser();
    const token = generateJwt(user);
    const res = await app
      .patch("/characters/1")
      .send({ fav: true })
      .auth(token, { type: "bearer" });
    expect(res.status).toBe(200);
    expect(res.body.favourite).toBe(true);
  });

  it("can unfav a character", async () => {
    const app = supertest(createServer());
    const user = await TestHelper.getOrCreateUser();
    const token = generateJwt(user);
    const res = await app
      .patch("/characters/1")
      .send({ fav: false })
      .auth(token, { type: "bearer" });
    expect(res.status).toBe(200);
    expect(res.body.favourite).toBe(false);
  });

  it("returns error if no data is passed when faving a character", async () => {
    const app = supertest(createServer());
    const user = await TestHelper.getOrCreateUser();
    const token = generateJwt(user);
    const res = await app
      .patch("/characters/1")
      .auth(token, { type: "bearer" });
    expect(res.status).toBe(400);
  });

  it("returns error if bad id is passed", async () => {
    const app = supertest(createServer());
    const user = await TestHelper.getOrCreateUser();
    const token = generateJwt(user);
    const res = await app
      .patch("/characters/foo")
      .auth(token, { type: "bearer" });
    expect(res.status).toBe(400);
  });
});
