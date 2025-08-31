// netlify/functions/get-job-references.js
import fetch from "node-fetch";

export const handler = async () => {
  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

    // Full Airtable API URL to your Jobs table
    const url = "https://api.airtable.com/v0/appfqc5gFS9XFw6Yx/Jobs";

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

    // Return array of objects with full job details for preview
    const jobs = data.records.map(r => ({
      reference: r.fields.Reference,
      customer: r.fields.Name,
      pickup: r.fields.Pickup,
      delivery: r.fields.Delivery,
      vehicle: r.fields.Vehicle,
      status: r.fields.Status
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
