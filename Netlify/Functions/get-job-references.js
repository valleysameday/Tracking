import fetch from "node-fetch";

export const handler = async () => {
  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const BASE_ID = "appfqc5gFS9XFw6Yx";
    const TABLE_NAME = "Jobs";

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

    const jobs = data.records.map((r) => {
      const recordId = r.id;
      const fallbackRef = `VAL-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${recordId.slice(-4)}`;

      return {
        reference: r.fields.Reference || fallbackRef,
        name: r.fields.Name || "",
        pickup: r.fields.Pickup || "",
        delivery: r.fields.Delivery || "",
        vehicle: r.fields.Vehicle || "",
        status: r.fields.Status || "",
      };
    });

    console.log("📋 Mapped references:", jobs.map(j => j.reference));

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
