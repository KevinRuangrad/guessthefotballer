import { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const GuessThePlayer = () => {
  const [league, setLeague] = useState("");
  const [randomPlayer, setRandomPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [isLeagueSelected, setIsLeagueSelected] = useState(false);

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
        setPlayers(data.players);
        pickRandomPlayer(data.players);
      })
      .catch((error) => console.error("Error fetching players:", error));
  };

  const pickRandomPlayer = (playersList) => {
    const randomIndex = Math.floor(Math.random() * playersList.length);
    const player = playersList[randomIndex];
    console.log("Randomly selected player:", player);
    setRandomPlayer(player);
  };

  const handleLeagueChange = (event) => {
    setLeague(event.target.value);
    setIsLeagueSelected(true);
  };

  const handleInputChange = (event) => {
    const searchText = event.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (searchText.length >= 3) {
      const filtered = players.filter(player =>
        player.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchText)
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers([]);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center text-white p-6">
      <div className="backdrop-blur-custom p-10 w-3xl h-auto rounded-4xl">
        <FormControl>
          <FormLabel
            id="demo-radio-buttons-group-label"
            sx={{
              color: "white",
              "&.Mui-focused": {
                color: "white", // Change this to your desired color for the focused state
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
            sx={{ color: "white" }}
          >
            <FormControlLabel
              value="PL"
              control={<Radio sx={{ color: "white" }} />}
              label="Premier League"
              sx={{ color: "white" }}
            />
            <FormControlLabel
              value="BL1"
              control={<Radio sx={{ color: "white" }} />}
              label="Bundesliga"
              sx={{ color: "white" }}
            />
            <FormControlLabel
              value="PD"
              control={<Radio sx={{ color: "white" }} />}
              label="La Liga"
              sx={{ color: "white" }}
            />
            <FormControlLabel
              value="SA"
              control={<Radio sx={{ color: "white" }} />}
              label="Seria A"
              sx={{ color: "white" }}
            />
          </RadioGroup>
        </FormControl>
        <h2 className="text-3xl pt-10 text-center mb-4">Which player are we looking for?</h2>
        <form className="flex justify-center relative w-full">
          <input
            type="text"
            autoComplete="off"
            name="text"
            className="input w-full"
            placeholder={isLeagueSelected ? "Search for a player" : "Select a League"}
            onChange={handleInputChange}
            readOnly={!isLeagueSelected}
            onBlur={() => setFilteredPlayers([])}
            onFocus={(event) => {
              if (event.target.value.length >= 3) {
                const searchText = event.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const filtered = players.filter(player =>
                  player.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchText)
                );
                setFilteredPlayers(filtered);
              }
            }}
          />
          {filteredPlayers.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white text-black z-10 max-h-60 overflow-y-auto input">
              {filteredPlayers.map(player => (
                <div key={player.id} className="p-2 border-b border-gray-300 flex items-center">
                  <img src={player.crest} alt={`${player.name} club crest`} className="h-[40px] mr-2" />
                  <p>{player.name}</p>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default GuessThePlayer;