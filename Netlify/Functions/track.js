const fetch = require("node-fetch");

exports.handler = async function(event) {
  const ref = event.queryStringParameters.ref?.toLowerCase();
  if (!ref) {
    return {
      statusCode: 400,
      body: "Missing reference number"
    };
  }

  const airtableURL = `https://api.airtable.com/v0/appWfZWp6BO6RWVIU/Jobs?filterByFormula=LOWER({reference})='${ref}'`;

  try {
    const response = await fetch(airtableURL, {
      headers: {
        Authorization: "Bearer patlxxUoEWAggd4vy.e3c7c1f804e8f595d3ec21514c1cd89de528d6a9bd8c72b53483ae0681022f25",
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
        reference: record.reference,
        status: record.status,
        driver: record.driver,
        timestamp: record.timestamp,
        notes: record.notes,
        imageURL: record.imageURL
      })
    };
  } catch (err) {
    console.error("Airtable fetch error:", err);
    return {
      statusCode: 500,
      body: "Error fetching delivery status"
    };
  }
};
