const fetch = require("node-fetch");

exports.handler = async function(event) {
  const ref = event.queryStringParameters.ref?.toLowerCase();
  if (!ref) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing reference number" })
    };
  }

  const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
  const BASE_ID = "appfqc5gFS9XFw6Yx";
  const TABLE_NAME = "Jobs";

  const airtableURL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=LOWER({Reference})='${ref}'`;

  try {
    const response = await fetch(airtableURL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Reference not found" })
      };
    }

    const record = data.records[0].fields;

    return {
      statusCode: 200,
      body: JSON.stringify({
        reference: record.Reference,
        status: record.Status,
        driver: record.Driver || record["Driver Name"],
        leftWith: record["Left With"],
        notes: record.Notes,
        timestamp: record.Timestamp
      })
    };
  } catch (err) {
    console.error("Airtable fetch error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching delivery status" })
    };
  }
};
