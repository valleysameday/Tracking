const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { reference, driver, notes, timestamp, podImage } = JSON.parse(event.body);

  const baseId = process.env.AIRTABLE_API;
  const tableName = "Jobs";
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
  const headers = {
    Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
    "Content-Type": "application/json"
  };

  try {
    // Step 1: Find the job by Reference
    const searchUrl = `${url}?filterByFormula=SEARCH("${reference}", {Reference})`;
    const searchRes = await fetch(searchUrl, { headers });
    const searchData = await searchRes.json();

    if (!searchData.records || searchData.records.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Job not found" })
      };
    }

    const jobId = searchData.records[0].id;

    // Step 2: Patch the job record with POD data
    const updateRes = await fetch(`${url}/${jobId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        fields: {
          "Driver": driver,
          "Notes": notes,
          "POD Timestamp": timestamp,
          "POD Submitted": true,
          "POD Image": podImage ? [{ url: podImage }] : []
        }
      })
    });

    const updateData = await updateRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, updated: updateData })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to submit POD", details: err.message })
    };
  }
};
