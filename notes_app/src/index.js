import app from "./app.js";
import { createAdminUser, createUser } from "./libs/createUser.js";
import "./database.js";

async function main() {
  if(process.env.CREATE_ADMIN !== "false"){
    await createAdminUser();
  }

  if(process.env.CREATE_USER !== "false"){
    await createUser();
  }

  app.listen(app.get("port"));

  console.log("Server on port", app.get("port"));
  console.log("Environment:", process.env.NODE_ENV);
}

main();
