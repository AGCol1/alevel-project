    async function loadTeams() {
      try {
        const res = await fetch('http://localhost:8000/backend/getTeams.php');
        if (!res.ok) throw new Error('Network response was not ok');

        const data = await res.json();
        console.log(data);

        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        console.error("Fetch error:", err);
        document.getElementById('output').textContent = "Error loading teams: " + err;
      }
    }

    loadTeams();