import {
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, {useState, useEffect} from "react";

export default function MainDisplay() {
  const [view, setView] = useState(0);

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newView: string
  ) => setView(newView);
  return (
    <Paper>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={handleAlignment}
    
      >
        <ToggleButton value={0} aria-label="left aligned">
          <Typography>Random View</Typography>
        </ToggleButton>
        <ToggleButton value={1} aria-label="centered">
          <Typography>Latest Collected</Typography>
        </ToggleButton>
        <ToggleButton value={2} aria-label="right aligned">
          <Typography>View Other Address</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Paper>
  );
}


function ToggleBar(