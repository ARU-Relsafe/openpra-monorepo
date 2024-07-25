/**
 * Main entry point for the Job Broker application.
 *
 * This file is responsible for bootstrapping the NestJS application, which includes
 * initializing the application's root module (`JobBrokerModule`) and starting the
 * application's web server.
 *
 */

import { NestFactory } from "@nestjs/core";
import { JobBrokerModule } from "./job-broker.module";

/**
 * Asynchronously bootstraps the application.
 *
 * This function initializes the NestJS application by creating an instance of the `JobBrokerModule`
 * and starts listening for incoming HTTP requests on a specified port (default is 3000).
 *
 * @remarks
 * The `bootstrap` function is an asynchronous function, which allows for asynchronous operations
 * that may be required during the application initialization phase (e.g., database connections,
 * configuration loading, etc.).
 *
 * @returns A Promise that resolves when the application has been successfully bootstrapped and is
 *          listening for incoming connections.
 */
async function bootstrap(): Promise<void> {
  // Creating an instance of the application by passing the root module (`JobBrokerModule`) to the `NestFactory.create` method.
  const app = await NestFactory.create(JobBrokerModule);

  // Instructing the application to start listening for incoming HTTP requests on port 3000.
  // This effectively starts the web server and makes the application accessible.
  await app.listen(3000);
}

// Executing the `bootstrap` function to start the application.
// The `void` operator is used here to explicitly indicate that the returned Promise is intentionally not handled.
void bootstrap();
