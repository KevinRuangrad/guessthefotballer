import PlayerCard from './PlayerCard';
import PropTypes from 'prop-types';

const GuessedPlayers = ({ guessedPlayers, randomPlayer, calculateAge, getPositionAbbreviation, getAgeComparisonArrow, getAgeComparisonClass, guesses, restartGame }) => {
  const hasWon = guessedPlayers.some(player => player.name === randomPlayer.name);

  return (
    <div className="mt-4">
      {guesses >= 6 && !hasWon && (
        <div className="mb-4 p-4 border-4 rounded-lg flex flex-col items-center justify-around guessesDiv">
          <h2 className="text-3xl font-bold text-white mb-4">YOU LOST, CORRECT ANSWER:</h2>
          <PlayerCard
            player={randomPlayer}
            randomPlayer={randomPlayer}
            calculateAge={calculateAge}
            getPositionAbbreviation={getPositionAbbreviation}
            getAgeComparisonArrow={getAgeComparisonArrow}
            getAgeComparisonClass={getAgeComparisonClass}
          />
        </div>
      )}
      <h3 className="text-2xl mb-2">Guessed Players:</h3>
      {guessedPlayers.length > 0 ? (
        <div>
          {guessedPlayers.slice().reverse().map((player, index) => (
            <PlayerCard
              key={index}
              player={player}
              randomPlayer={randomPlayer}
              calculateAge={calculateAge}
              getPositionAbbreviation={getPositionAbbreviation}
              getAgeComparisonArrow={getAgeComparisonArrow}
              getAgeComparisonClass={getAgeComparisonClass}
              guessNumber={guessedPlayers.length - index}
            />
          ))}
        </div>
      ) : (
        <p>No players guessed yet.</p>
      )}
      {(guesses >= 6 || hasWon) && (
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded"
          onClick={restartGame}
        >
          Restart Game
        </button>
      )}
    </div>
  );
};

GuessedPlayers.propTypes = {
  guessedPlayers: PropTypes.array.isRequired,
  randomPlayer: PropTypes.object.isRequired,
  calculateAge: PropTypes.func.isRequired,
  getPositionAbbreviation: PropTypes.func.isRequired,
  getAgeComparisonArrow: PropTypes.func.isRequired,
  getAgeComparisonClass: PropTypes.func.isRequired,
  guesses: PropTypes.number.isRequired,
  restartGame: PropTypes.func.isRequired,
};

export default GuessedPlayers;