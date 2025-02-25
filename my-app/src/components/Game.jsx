import { useState, useEffect, useRef } from "react";
import LeagueSelector from "./LeagueSelector";
import PlayerSearch from "./PlayerSearch";
import GuessedPlayers from "./GuessedPlayers";
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
    fetch(`https://guessthefootballerbackend.vercel.app/api/competitions/${leagueCode}/teams`)
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
    fetch(`https://guessthefootballerbackend.vercel.app/api/flags/${encodeURIComponent(nationality)}`)
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
        <LeagueSelector league={league} handleLeagueChange={handleLeagueChange} />
        <h2 className="text-3xl pt-10 text-center mb-4">Which player are we looking for?</h2>
        <PlayerSearch
          isLeagueSelected={isLeagueSelected}
          handleInputChange={handleInputChange}
          handleBlur={handleBlur}
          filteredPlayers={filteredPlayers}
          displayGuess={displayGuess}
          inputRef={inputRef}
          players={players}
          setFilteredPlayers={setFilteredPlayers}
        />
        <GuessedPlayers
          guessedPlayers={guessedPlayers}
          randomPlayer={randomPlayer}
          calculateAge={calculateAge}
          getPositionAbbreviation={getPositionAbbreviation}
          getAgeComparisonArrow={getAgeComparisonArrow}
          getAgeComparisonClass={getAgeComparisonClass}
          guesses={guesses}
          restartGame={restartGame}
        />
      </div>
    </div>
  );
};

export default GuessThePlayer;