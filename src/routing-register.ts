import path from "path";
import fs from "fs";

export const autoregisterEndpoints = (
  app: { use: (arg0: any, arg1: any) => void },
  pathEndpoints = "routes"
) => {
  const endpointsPath = path.join(__dirname, pathEndpoints);
  fs.readdirSync(endpointsPath).forEach((file) => {
    let include = includeFile(file);
    if (include) {
      let path = require(`./${pathEndpoints}/` + file);
      console.log(path.default);
      //       app.use(path, router);
    }
  });
};

const includeFile = (file: string) => {
  const file_splited = file.split(".");
  let extension = file_splited[file_splited.length - 1];
  return extension == "ts";
};
