import Database from "better-sqlite3";
import "reflect-metadata";
import { User } from "../entity";
import datasource from "../config/datasources/datasource";

export class TestHelper {
  private static testdb: Database.Database;

  static setupTestDB(): void {
    this.testdb = new Database(":memory:");
  }

  static teardownTestDB(): void {
    this.testdb.close();
  }

  static async getOrCreateUser(): Promise<User> {
    const userRepo = datasource.getRepository(User);
    const user = await userRepo.findOneBy({ email: "jared@foo.com" });
    if (!user) {
      return userRepo.save(
        userRepo.create({
          name: "Jared",
          email: "jared@foo.com",
          password: "fakepassword",
        }),
      );
    }

    return user;
  }
}
