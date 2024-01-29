import { testDataSource } from "./testDatasource";
import { mainDataSource } from "./mainDatasource";

export default process.env.NODE_ENV === "test"
  ? testDataSource
  : mainDataSource;
