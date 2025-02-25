import PropTypes from 'prop-types';

const PlayerSearch = ({ isLeagueSelected, handleInputChange, handleBlur, filteredPlayers, displayGuess, inputRef, players, setFilteredPlayers }) => {
  return (
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
  );
};

PlayerSearch.propTypes = {
  isLeagueSelected: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  filteredPlayers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      crest: PropTypes.string.isRequired,
    })
  ).isRequired,
  displayGuess: PropTypes.func.isRequired,
  inputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      crest: PropTypes.string.isRequired,
    })
  ).isRequired,
  setFilteredPlayers: PropTypes.func.isRequired,
};

export default PlayerSearch;