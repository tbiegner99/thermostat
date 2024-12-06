async function checkHealth() {
  try {
    const healthCheck = await fetch("http://heating.local/api/health");
    //fail if the health check fails
    if (healthCheck.status !== 200) {
      console.log("Health check failed with status " + healthCheck.status);
      process.exit(-1);
    }
    //fail if last temperature collection is older than 5 minutes
    const responseBody = await healthCheck.json();

    console.log(responseBody);
    const now = new Date().valueOf();
    const lastUpdate = Date.parse(responseBody.lastUpdate);
    if (now - lastUpdate > 5 * 60 * 1000) {
      console.log("Last update is older than 5 minutes");
      process.exit(-3);
    }
    console.log("Health check passed");
  } catch (error) {
    console.log("Health check failed");
    process.exit(-2);
  }
  process.exit(0);
}
checkHealth();
