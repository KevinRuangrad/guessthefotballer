import { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const GuessThePlayer = () => {
  const [league, setLeague] = useState("");
  const [randomPlayer, setRandomPlayer] = useState(null);

  const apiKey = "89f248d41b6d42fc8551d25629afd388";

  useEffect(() => {
    if (league) {
      fetchPlayers(league);
    }
  }, [league]);

  const fetchPlayers = (leagueCode) => {
    fetch(`https://api.football-data.org/v4/competitions/${leagueCode}/teams`, {
      headers: {
        "X-Auth-Token": apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const allPlayers = [];
        data.teams.forEach((team) => {
          allPlayers.push(...team.squad);
        });
        pickRandomPlayer(allPlayers);
      })
      .catch((error) => console.error("Error fetching players:", error));
  };

  const pickRandomPlayer = (playersList) => {
    const randomIndex = Math.floor(Math.random() * playersList.length);
    const player = playersList[randomIndex];
    setRandomPlayer(player);
  };

  const handleLeagueChange = (event) => {
    setLeague(event.target.value);
  };

  return (
    <div className="flex justify-center flex-col items-center text-white p-6">
      <FormControl>
        <FormLabel 
          id="demo-radio-buttons-group-label"
          sx={{ 
            color: 'white',
            '&.Mui-focused': {
              color: 'white', // Change this to your desired color for the focused state
            },
          }}
        >
          Select a league
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="PL"
          name="radio-buttons-group"
          onChange={handleLeagueChange}
          value={league}
          sx={{ color: 'white' }}
        >
          <FormControlLabel
            value="PL"
            control={<Radio sx={{ color: 'white' }} />} 
            label="Premier League"
            sx={{ color: 'white' }}
          />
          <FormControlLabel
            value="BL1"
            control={<Radio sx={{ color: 'white' }} />} 
            label="Bundesliga"
            sx={{ color: 'white' }}
          />
          <FormControlLabel 
            value="PD" 
            control={<Radio sx={{ color: 'white' }} />} 
            label="La Liga" 
            sx={{ color: 'white' }}
          />
        </RadioGroup>
      </FormControl>

      {randomPlayer && (
        <div>
          <p>Player to Guess: {randomPlayer.name}</p>
        </div>
      )}
    </div>
  );
};

export default GuessThePlayer;
