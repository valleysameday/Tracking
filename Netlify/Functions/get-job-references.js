// netlify/functions/get-job-references.js
import fetch from "node-fetch";

export const handler = async () => {
  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY; // your Airtable PAT
    const BASE_ID = "appfqc5gFS9XFw6Yx"; // your base ID
    const TABLE_NAME = "Jobs";           // your table name

    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    console.log("🔹 Fetching jobs from Airtable...");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Retrieved ${data.records.length} records`);

    // Map to simplified structure for dropdown + preview
    const jobs = data.records.map((r) => ({
      reference: r.fields.Reference,
      customer: r.fields.Customer || "",
      pickup: r.fields.Pickup || "",
      delivery: r.fields.Delivery || "",
      vehicle: r.fields.Vehicle || "",
      status: r.fields.Status || "",
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(jobs),
    };
  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch jobs" }),
    };
  }
};
