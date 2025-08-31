const fetch = require('node-fetch');

exports.handler = async () => {
  const baseIdOrUrl = process.env.AIRTABLE_API;
  const tableName = "Jobs";

  const baseUrl = baseIdOrUrl.includes("https://")
    ? baseIdOrUrl
    : `https://api.airtable.com/v0/${baseIdOrUrl}/${tableName}`;

  let allRecords = [];
  let offset = null;

  try {
    do {
      const url = offset ? `${baseUrl}?offset=${offset}` : baseUrl;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (data.records) {
        allRecords = allRecords.concat(data.records);
      }

      offset = data.offset;
    } while (offset);

    console.log(`✅ Total records fetched: ${allRecords.length}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ records: allRecords })
    };
  } catch (err) {
    console.error("❌ Airtable fetch error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch all jobs", details: err.message })
    };
  }
};
