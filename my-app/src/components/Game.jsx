import { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const GuessThePlayer = () => {
  const [league, setLeague] = useState("");
  const [randomPlayer, setRandomPlayer] = useState(null);

  useEffect(() => {
    if (league) {
      fetchPlayers(league);
    }
  }, [league]);

  const fetchPlayers = (leagueCode) => {
    fetch(`http://localhost:3000/api/competitions/${leagueCode}/teams`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.players) {
          throw new Error("No players found");
        }
        pickRandomPlayer(data.players);
      })
      .catch((error) => console.error("Error fetching players:", error));
  };

  const pickRandomPlayer = (playersList) => {
    const randomIndex = Math.floor(Math.random() * playersList.length);
    const player = playersList[randomIndex];
    setRandomPlayer(player);
    console.log(player);
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
    </div>
  );
};

export default GuessThePlayer;