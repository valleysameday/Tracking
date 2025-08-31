import fetch from "node-fetch";

export const handler = async (event) => {
  console.log("🚀 submit-job-update function triggered");

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

  // Step 1: Find the record with matching Reference
  const filterFormula = `filterByFormula=${encodeURIComponent(`{Reference} = "${data.reference}"`)}`;
  const searchUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?${filterFormula}`;

  console.log("🔍 Searching Airtable for reference:", data.reference);

  let searchRes, searchData;
  try {
    searchRes = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    searchData = await searchRes.json();
  } catch (err) {
    console.error("❌ Error fetching Airtable record:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch job record", details: err.message })
    };
  }

  if (!searchRes.ok || !searchData.records.length) {
    console.error("❌ No matching job found for reference:", data.reference);
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Job not found for reference", reference: data.reference })
    };
  }

  const recordId = searchData.records[0].id;
  console.log("✅ Found matching job record:", recordId);

  // Step 2: Update the record with Driver, Notes, Timestamp
  const updateBody = {
    fields: {
      Driver: data.driver,
      Notes: data.notes,
      Timestamp: data.timestamp
    }
  };

  let updateRes, updateResult;
  try {
    updateRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${recordId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateBody)
    });

    updateResult = await updateRes.json();
    console.log("📦 Airtable update response:", updateResult, "| Status:", updateRes.status);
  } catch (err) {
    console.error("❌ Error updating Airtable record:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update job record", details: err.message })
    };
  }

  return {
    statusCode: updateRes.ok ? 200 : 500,
    body: JSON.stringify(updateResult)
  };
};
