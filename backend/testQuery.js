const pool = require("./db");

async function testQuery() {
  try {
    const result = await pool.query("SELECT NOW();");
    console.log("✅ Current Timestamp:", result.rows[0]);
  } catch (err) {
    console.error("❌ Query failed:", err);
  }
}

testQuery();
