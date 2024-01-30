import { testDatasource } from "./test-datasource";
import { mainDataSource } from "./main-datasource";

export default process.env.NODE_ENV === "test"
  ? testDatasource
  : mainDataSource;
