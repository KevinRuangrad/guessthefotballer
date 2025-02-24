import { useState, useEffect, useRef } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const GuessThePlayer = () => {
  const [league, setLeague] = useState("");
  const [randomPlayer, setRandomPlayer] = useState(null);
  const [randomPlayerFlag, setRandomPlayerFlag] = useState("");
  const [guessedPlayers, setGuessedPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [isLeagueSelected, setIsLeagueSelected] = useState(false);
  const [guesses, setGuesses] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (league) {
      fetchPlayers(league);
    }
  }, [league]);

  const fetchPlayers = (leagueCode) => {
    fetch(`http://guessthefootballerbackend.vercel.app/api/competitions/${leagueCode}/teams`)
      .then((response) => response.json())
      .then((data) => {
        setPlayers(data.players);
        pickRandomPlayer(data.players);
      })
      .catch((error) => console.error("Error fetching players:", error));
  };

  const pickRandomPlayer = (playersList) => {
    const randomIndex = Math.floor(Math.random() * playersList.length);
    const player = playersList[randomIndex];
    setRandomPlayer(player);
    fetchFlag(player.nationality, setRandomPlayerFlag);
  };

  const fetchFlag = (nationality, setFlag) => {
    fetch(`http://guessthefootballerbackend.vercel.app/api/flags/${encodeURIComponent(nationality)}`)
      .then((response) => response.json())
      .then((data) => {
        setFlag(data.flag);
      })
      .catch((error) => console.error(`Error fetching flag for ${nationality}:`, error));
  };

  const handleLeagueChange = (event) => {
    setLeague(event.target.value);
    setIsLeagueSelected(true);
    setGuessedPlayers([]);
    setGuesses(0);
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

  const displayGuess = (player) => {
    fetchFlag(player.nationality, (flag) => {
      setGuessedPlayers((prevGuessedPlayers) => [...prevGuessedPlayers, { ...player, flag }]);
      setGuesses(prevGuesses => prevGuesses + 1);
    });
    setFilteredPlayers([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setFilteredPlayers([]);
    }, 200); 
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getPositionAbbreviation = (position) => {
    const positionMap = {
      "Goalkeeper": "GK",
      "Defence": "DEF",
      "Midfield": "MF",
      "Offence": "FWD",
      "Left Winger": "LW",
      "Right Winger": "RW",
      "Right-Back": "RB",
      "Left-Back": "LB",
      "Centre-Back": "CB",
      "Defensive Midfield": "CDM",
      "Central Midfield": "CM",
      "Attacking Midfield": "CAM",
      "Centre-Forward": "ST",
      "Right-Midfield": "RM",
      "Left-Midfield": "LM",
    };
    return positionMap[position] || position;
  };

  const getAgeComparisonArrow = (guessedPlayerAge, randomPlayerAge) => {
    if (guessedPlayerAge < randomPlayerAge) {
      return <FontAwesomeIcon icon={faArrowUp} />;
    } else if (guessedPlayerAge > randomPlayerAge) {
      return <FontAwesomeIcon icon={faArrowDown} />;
    } else {
      return null;
    }
  };

  const getAgeComparisonClass = (guessedPlayerAge, randomPlayerAge) => {
    if (guessedPlayerAge < randomPlayerAge) {
      return 'text-red-500';
    } else if (guessedPlayerAge > randomPlayerAge) {
      return 'text-red-500';
    } else {
      return 'text-green-500';
    }
  };

  const restartGame = () => {
    setGuessedPlayers([]);
    setGuesses(0);
    pickRandomPlayer(players);
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
                color: "white",
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
            onBlur={handleBlur}
            ref={inputRef}
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
                <div key={player.id} className="p-2 border-b border-gray-300 flex items-center" onClick={() => displayGuess(player)}>
                  <img src={player.crest} alt={`${player.name} club crest`} className="h-[40px] mr-2" />
                  <p>{player.name}</p>
                </div>
              ))}
            </div>
          )}
        </form>
        <div className="mt-4">
          {guesses >= 6 && (
            <div className="mb-4 p-4 border-4 rounded-lg flex flex-col items-center justify-around guessesDiv">
              <h2 className="text-3xl font-bold text-white mb-4">YOU LOST, CORRECT ANSWER:</h2>
              <div className="flex justify-between w-full">
                <p className="text-lg font-semibold mb-2 text-left text-green-500">{randomPlayer.name}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 p-2 text-lg bg-white text-black font-semibold flex justify-center items-center border-4 border-green-500">
                      <div className="text-center">
                        {randomPlayerFlag ? <img src={randomPlayerFlag} alt={`${randomPlayer.nationality} flag`} className="w-[56px] inline" /> : null}
                      </div>
                    </div>
                    <div className="text-center font-semibold text-green-500">NAT</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 p-2 text-lg bg-white text-black font-semibold flex justify-center items-center border-4 border-green-500">
                      <div className="text-center"><img src={`${randomPlayer.league}`} alt="league" /></div>
                    </div>
                    <div className="text-center font-semibold text-green-500">LEAGUE</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 p-2 text-lg bg-white text-black font-semibold flex justify-center items-center border-4 border-green-500">
                      <div className="text-center"><img src={`${randomPlayer.crest}`} alt="league" /></div>
                    </div>
                    <div className="text-center font-semibold text-green-500">CLUB</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 p-2 text-lg bg-white text-black font-semibold flex justify-center items-center border-4 border-green-500">
                      <div className="text-center">{getPositionAbbreviation(randomPlayer.position)}</div>
                    </div>
                    <div className="text-center font-semibold text-green-500">POS</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 p-2 text-lg bg-white text-black font-semibold flex justify-center items-center border-4 border-green-500">
                      <div className="text-center">{calculateAge(randomPlayer.dateOfBirth)}</div>
                    </div>
                    <div className="text-center font-semibold text-green-500">
                      AGE {getAgeComparisonArrow(calculateAge(randomPlayer.dateOfBirth), calculateAge(randomPlayer.dateOfBirth))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <h3 className="text-2xl mb-2">Guessed Players:</h3>
          {guessedPlayers.length > 0 ? (
            <div>
              {guessedPlayers.map((player, index) => (
                <div key={index} className="mb-4 p-4 border-4 rounded-lg flex flex-col items-center justify-around guessesDiv">
                  <div className="flex justify-between w-full">
                    <p className={`text-lg font-semibold mb-2 text-left ${player.name === randomPlayer.name ? 'text-green-500' : 'text-red-500'}`}>{player.name}</p>
                    <p className="text-lg font-semibold mb-2">Guesses: {index + 1}/6</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-20 h-20 p-2 border-2 text-lg bg-white text-black font-semibold flex justify-center items-center ${player.nationality === randomPlayer.nationality ? 'border-4 border-green-500' : 'border-4 border-red-500'}`}>
                          <div className="text-center">
                            {player.flag ? <img src={player.flag} alt={`${player.nationality} flag`} className="w-[56px] inline" /> : null}
                          </div>
                        </div>
                        <div className={`text-center font-semibold ${player.nationality === randomPlayer.nationality ? 'text-green-500' : 'text-red-500'}`}>NAT</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-20 h-20 p-2 border-2 text-lg bg-white text-black font-semibold flex justify-center items-center ${player.league === randomPlayer.league ? 'border-4 border-green-500' : 'border-4 border-red-500'}`}>
                          <div className="text-center"><img src={`${player.league}`} alt="league" /></div>
                        </div>
                        <div className={`text-center font-semibold ${player.league === randomPlayer.league ? 'text-green-500' : 'text-red-500'}`}>LEAGUE</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-20 h-20 p-2 border-2 text-lg bg-white text-black font-semibold flex justify-center items-center ${player.club === randomPlayer.club ? 'border-4 border-green-500' : 'border-4 border-red-500'}`}>
                          <div className="text-center"><img src={`${player.crest}`} alt="league" /></div>
                        </div>
                        <div className={`text-center font-semibold ${player.club === randomPlayer.club ? 'text-green-500' : 'text-red-500'}`}>CLUB</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-20 h-20 p-2 border-2 text-lg bg-white text-black font-semibold flex justify-center items-center ${player.position === randomPlayer.position ? 'border-4 border-green-500' : 'border-4 border-red-500'}`}>
                          <div className="text-center">{getPositionAbbreviation(player.position)}</div>
                        </div>
                        <div className={`text-center font-semibold ${player.position === randomPlayer.position ? 'text-green-500' : 'text-red-500'}`}>POS</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-20 h-20 p-2 border-2 text-lg bg-white text-black font-semibold flex justify-center items-center ${calculateAge(player.dateOfBirth) === calculateAge(randomPlayer.dateOfBirth) ? 'border-4 border-green-500' : 'border-4 border-red-500'}`}>
                          <div className="text-center">{calculateAge(player.dateOfBirth)}</div>
                        </div>
                        <div className={`text-center font-semibold ${getAgeComparisonClass(calculateAge(player.dateOfBirth), calculateAge(randomPlayer.dateOfBirth))}`}>
                          AGE {getAgeComparisonArrow(calculateAge(player.dateOfBirth), calculateAge(randomPlayer.dateOfBirth))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No players guessed yet.</p>
          )}
          {guesses >= 6 && (
            <button
              className="mt-4 p-2 bg-blue-500 text-white rounded"
              onClick={restartGame}
            >
              Restart Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuessThePlayer;