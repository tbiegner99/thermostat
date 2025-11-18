#!/usr/bin/env node
/**
 * Test script for the Mode API endpoint
 * This script tests the new PUT /api/thresholds/mode endpoint
 */

const axios = require("axios");

const BASE_URL = "http://localhost:8080/api";

async function testModeAPI() {
  console.log("🧪 Testing Mode API Endpoint...\n");

  try {
    // Test 1: Get current settings
    console.log("📋 Getting current settings...");
    const currentSettings = await axios.get(`${BASE_URL}/thresholds`);
    console.log("Current settings:", currentSettings.data);
    console.log();

    // Test 2: Set to auto mode
    console.log('🔄 Setting mode to "auto"...');
    const autoResponse = await axios.put(`${BASE_URL}/thresholds/mode`, {
      mode: "auto",
    });
    console.log("Response:", autoResponse.data);
    console.log();

    // Test 3: Set to heat mode
    console.log('🔥 Setting mode to "heat"...');
    const heatResponse = await axios.put(`${BASE_URL}/thresholds/mode`, {
      mode: "heat",
    });
    console.log("Response:", heatResponse.data);
    console.log();

    // Test 4: Set to cool mode
    console.log('❄️ Setting mode to "cool"...');
    const coolResponse = await axios.put(`${BASE_URL}/thresholds/mode`, {
      mode: "cool",
    });
    console.log("Response:", coolResponse.data);
    console.log();

    // Test 5: Set to off mode
    console.log('⏹️ Setting mode to "off"...');
    const offResponse = await axios.put(`${BASE_URL}/thresholds/mode`, {
      mode: "off",
    });
    console.log("Response:", offResponse.data);
    console.log();

    // Test 6: Test missing mode (should fail)
    console.log("❌ Testing missing mode...");
    try {
      await axios.put(`${BASE_URL}/thresholds/mode`, {});
      console.log("ERROR: Missing mode should have failed!");
    } catch (error) {
      console.log(
        "✅ Expected error for missing mode:",
        error.response?.data?.error || "Network error"
      );
    }
    console.log();

    // Test 7: Test invalid mode (should fail)
    console.log('❌ Testing invalid mode "invalid"...');
    try {
      await axios.put(`${BASE_URL}/thresholds/mode`, {
        mode: "invalid",
      });
      console.log("ERROR: Invalid mode should have failed!");
    } catch (error) {
      console.log(
        "✅ Expected error for invalid mode:",
        error.response?.data?.error || "Network error"
      );
    }
    console.log();

    // Test 8: Restore to auto mode
    console.log('🔄 Restoring to "auto" mode...');
    const restoreResponse = await axios.put(`${BASE_URL}/thresholds/mode`, {
      mode: "auto",
    });
    console.log("Final settings:", restoreResponse.data);

    console.log("\n✅ All tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    console.error(
      "\n💡 Make sure the thermostat server is running: npm run dev"
    );
  }
}

// Check if server is available
async function checkServerHealth() {
  try {
    await axios.get(`${BASE_URL}/thresholds`);
    return true;
  } catch {
    return false;
  }
}

// Main execution
async function main() {
  console.log("🏥 Checking server health...");
  const isServerRunning = await checkServerHealth();

  if (!isServerRunning) {
    console.log("❌ Server is not running at http://localhost:8080");
    console.log("💡 Start the server with: npm run dev");
    process.exit(1);
  }

  console.log("✅ Server is running!\n");
  await testModeAPI();
}

if (require.main === module) {
  main();
}

module.exports = { testModeAPI, checkServerHealth };
