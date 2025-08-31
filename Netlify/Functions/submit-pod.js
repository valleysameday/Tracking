import fetch from "node-fetch";

export const handler = async (event) => {
  console.log("🔹 Incoming POD submission event:", event.body);

  let data;
  try {
    data = JSON.parse(event.body);
    console.log("📋 Parsed JSON data:", data);
  } catch (err) {
    console.error("❌ Failed to parse JSON:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON", details: err.message })
    };
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = "appfqc5gFS9XFw6Yx";
  const TABLE_NAME = "Jobs";

  const body = {
    fields: {
      Reference: data.reference,
      Driver: data.driver,
      Notes: data.notes,
      Timestamp: data.timestamp
    }
  };

  console.log("🔹 Prepared Airtable request body:", body);

  try {
    const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const result = await res.json();
    console.log("📦 Airtable response:", result, "| Status:", res.status);

    return {
      statusCode: res.ok ? 200 : 500,
      body: JSON.stringify(result)
    };
  } catch (err) {
    console.error("❌ Error submitting to Airtable:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to submit POD", details: err.message })
    };
  }
};
