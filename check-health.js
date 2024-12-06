async function checkHealth() {
  try {
    const healthCheck = await fetch("http://localhost/api/health");
    //fail if the health check fails
    if (healthCheck.status !== 200) {
      console.log("Health check failed with status " + healthCheck.status);
      process.exit(-1);
    }
    //fail if last temperature collection is older than 5 minutes
    const responseBody = await healthCheck.json();

    console.log(responseBody);
    console.log(Date.parse(responseBody.lastTemperatureCollection));
  } catch (error) {
    console.log("Health check failed");
    process.exit(-2);
  }
  process.exit(0);
}
checkHealth();
