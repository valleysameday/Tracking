<script>
  document.getElementById("timestamp").value = new Date().toISOString();

  const form = document.getElementById("podForm");
  const successBox = document.getElementById("podSuccess");
  const referenceDropdown = document.getElementById("referenceDropdown");

  // Load references from Netlify function
  async function loadReferences() {
    try {
      const res = await fetch("/.netlify/functions/get-job-references");
      const refs = await res.json();

      refs.forEach(ref => {
        const option = document.createElement("option");
        option.value = ref;
        option.textContent = ref;
        referenceDropdown.appendChild(option);
      });
    } catch (err) {
      console.error("❌ Failed to load job references:", err);
    }
  }

  loadReferences();

  form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        successBox.style.display = "block";
        form.reset();
        document.getElementById("timestamp").value = new Date().toISOString();
      } else {
        const error = await res.text();
        console.error("❌ POD submission failed:", error);
        successBox.innerHTML = "❌ Something went wrong. Try again.";
        successBox.style.display = "block";
      }
    } catch (err) {
      console.error("❌ POD submission error:", err);
      successBox.innerHTML = "❌ Submission error. Try again.";
      successBox.style.display = "block";
    }
  });
</script>
