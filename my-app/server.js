import express from "express";
import fetch from "node-fetch"; // Import fetch from node-fetch

const app = express();
const PORT = 3000;
const API_KEY = "89f248d41b6d42fc8551d25629afd388"; // Replace with your new API key

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get('/api/competitions/:leagueCode/teams', async (req, res) => {
  const { leagueCode } = req.params;
  const url = `https://api.football-data.org/v4/competitions/${leagueCode}/teams`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    if (!response.ok) {
      res.status(response.status).json({ message: response.statusText });
      return;
    }

    const data = await response.json();
    const teamsWithPlayers = data.teams.map(team => {
      return team.squad.map(player => ({
        ...player,
        club: team.name
      }));
    }).flat();

    res.json({ players: teamsWithPlayers });
  } catch (error) {
    console.error("Error fetching data from API:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});