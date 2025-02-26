import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import PropTypes from 'prop-types';

const LeagueSelector = ({ league, handleLeagueChange }) => {
  return (
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
        <FormControlLabel
          value="CL"
          control={<Radio sx={{ color: "white" }} />}
          label="Champions League"
          sx={{ color: "white" }}
        />
      </RadioGroup>
    </FormControl>
  );
};
LeagueSelector.propTypes = {
  league: PropTypes.string.isRequired,
  handleLeagueChange: PropTypes.func.isRequired,
};

export default LeagueSelector;