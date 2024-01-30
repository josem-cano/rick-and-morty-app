import "reflect-metadata";
import { JwtPayload } from "jsonwebtoken";
import { TestHelper } from "../../utils/test-helper";
import { generateJwt, validateJwt } from "../../services/auth-service";
import datasource from "../../config/datasources/datasource";

describe("Auth Service", () => {
  beforeAll(async () => {
    TestHelper.setupTestDB();

    await datasource.initialize();
  });

  afterAll(async () => {
    TestHelper.teardownTestDB();
    await datasource.destroy();
  });

  it("Generates a token", async () => {
    const user = await TestHelper.getOrCreateUser();
    const jwt = generateJwt(user);
    expect(jwt).toBeDefined();
  });

  it("Token has proper payload", async () => {
    const user = await TestHelper.getOrCreateUser();
    const jwt = generateJwt(user);
    const payload = validateJwt(jwt) as JwtPayload;
    expect(payload).toMatchObject({
      name: user.name,
      id: user.id,
      email: user.email,
    });
  });
});
