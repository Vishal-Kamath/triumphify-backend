import { Logger } from "@/utils/logger";
import EmployeeSessionManager from "../entities/session/session.service.manager";

export function cleanup() {
  // Handle process exit event
  process.on("exit", async (code) => {
    await tasks();
  });

  // Handle Ctrl + C event
  process.on("SIGINT", async () => {
    await tasks();
    process.exit(0);
  });

  // Handle nodemon restart event
  process.on("SIGUSR2", async () => {
    await tasks();
    cleanup();
  });
}

async function tasks() {
  Logger.info("Cleaning up...");
  await EmployeeSessionManager.clearAll();
  Logger.success("Cleanup done");
}
