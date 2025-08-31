// netlify/functions/get-job-references.js
import fetch from "node-fetch";

export const handler = async () => {
  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const BASE_ID = "appfqc5gFS9XFw6Yx";   // Your Airtable Base ID
    const TABLE_NAME = "Jobs";              // Your table name
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    console.log("🔹 Fetching jobs from Airtable:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`❌ Airtable fetch failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Retrieved ${data.records.length} records from Airtable`);

    const jobs = data.records.map((r, index) => {
      const recordId = r.id;
      // Fallback reference if missing
      const fallbackRef = `VAL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${recordId.slice(-4)}`;

      const job = {
        reference: r.fields.Reference || fallbackRef,
        name: r.fields.Name || "",
        pickup: r.fields.Pickup || "",
        delivery: r.fields.Delivery || "",
        vehicle: r.fields.Vehicle || "",
        status: r.fields.Status || "",
      };

      console.log(`📋 Job #${index + 1}:`, job.reference, "| Customer:", job.name);
      return job;
    });

    console.log("📦 All mapped references:", jobs.map(j => j.reference));

    return {
      statusCode: 200,
      body: JSON.stringify(jobs),
    };

  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch jobs", details: err.message }),
    };
  }
};
