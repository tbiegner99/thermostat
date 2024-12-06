async function checkHealth() {
  process.exit(-1);
  try {
    const healthCheck = await fetch("http://localhost/api/health");
    //fail if the health check fails
    if (healthCheck.status !== 200) {
      console.log(
        `${new Date().toISOString()} - Health check failed with status ${
          healthCheck.status
        }`
      );
      process.exit(-1);
    }
    //fail if last temperature collection is older than 5 minutes
    const responseBody = await healthCheck.json();

    const now = new Date();
    const lastUpdate = Date.parse(responseBody.lastUpdate);
    if (now.valueOf() - lastUpdate > 5 * 60 * 1000) {
      console.log(
        `${now.toISOString()} - Health check failed. Update is older than 5 minutes`
      );
      process.exit(-3);
    }
    console.log(`${now.toISOString()} - Health check passed`);
  } catch (error) {
    console.log(`${now.toISOString()} - Health check failed`);
    process.exit(-2);
  }
  process.exit(0);
}
checkHealth();
