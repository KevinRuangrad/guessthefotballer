import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const PlayerCard = ({ player, randomPlayer, calculateAge, getPositionAbbreviation, getAgeComparisonArrow, getAgeComparisonClass, guessNumber }) => {
  const [flag, setFlag] = useState(player.flag);

  useEffect(() => {
    if (!player.flag) {
      fetchFlag(player.nationality, setFlag);
    } else {
      setFlag(player.flag);
    }
  }, [player]);

  const fetchFlag = (nationality, setFlag) => {
    fetch(`https://guessthefootballerbackend.vercel.app/api/flags/${encodeURIComponent(nationality)}`)
      .then((response) => response.json())
      .then((data) => {
        setFlag(data.flag);
      })
      .catch((error) => console.error(`Error fetching flag for ${nationality}:`, error));
  };

  const isSameNationality = (playerNationality, randomPlayerNationality) => {
    const ukNationalities = ['England', 'Wales', 'Scotland', 'Northern Ireland'];
    if (ukNationalities.includes(playerNationality) && ukNationalities.includes(randomPlayerNationality)) {
      return true;
    }
    return playerNationality === randomPlayerNationality;
  };

  return (
    <div className="mb-4 p-4 border-4 rounded-lg flex flex-col items-center justify-around guessesDiv">
      <div className="flex justify-between w-full">
        <p className={`text-lg font-semibold mb-2 text-left ${player.name === randomPlayer.name ? 'text-green-500' : 'text-red-500'}`}>{player.name}</p>
        {guessNumber && <p className="text-lg font-semibold mb-2">Guesses: {guessNumber}/6</p>}
      </div>
      <div className="flex flex-col items-center">
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 p-2 border-2 text-lg bg-white text-black font-semibold flex justify-center items-center ${isSameNationality(player.nationality, randomPlayer.nationality) ? 'border-4 border-green-500' : 'border-4 border-red-500'}`}>
              <div className="text-center">
                {flag ? <img src={flag} alt={`${player.nationality} flag`} className="w-[56px] inline" /> : null}
              </div>
            </div>
            <div className={`text-center font-semibold ${isSameNationality(player.nationality, randomPlayer.nationality) ? 'text-green-500' : 'text-red-500'}`}>NAT</div>
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
  );
};

PlayerCard.propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nationality: PropTypes.string.isRequired,
    flag: PropTypes.string,
    league: PropTypes.string.isRequired,
    crest: PropTypes.string,
    club: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    dateOfBirth: PropTypes.string.isRequired,
  }).isRequired,
  randomPlayer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    nationality: PropTypes.string.isRequired,
    flag: PropTypes.string,
    league: PropTypes.string.isRequired,
    club: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    dateOfBirth: PropTypes.string.isRequired,
  }).isRequired,
  calculateAge: PropTypes.func.isRequired,
  getPositionAbbreviation: PropTypes.func.isRequired,
  getAgeComparisonArrow: PropTypes.func.isRequired,
  getAgeComparisonClass: PropTypes.func.isRequired,
  guessNumber: PropTypes.number,
};

export default PlayerCard;