import React, { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box, Button, Paper } from "@mui/material";
import Random from "./Random";
import Sorted from "./Sorted";
import YourOwn from "./YourOwn";

export default function ToggleButtons() {
  const [view, setView] = useState(0);

  const handleView = (event: any, newView: any) => {
    setView(newView);
  };

  return (
    <>
      {view != 2 && (
        <Paper
          elevation={3}
          sx={{ mb: 4 }}
          // style={{
          //   display: "flex",
          //   justifyContent: "space-between",
          //   alignItems: "center",
          //   gap: "1rem",
          //   padding: "1rem",
          // }}
        >
          <ToggleButtonGroup value={view} exclusive onChange={handleView}>
            <ToggleButton value={0}>Random</ToggleButton>
            <ToggleButton value={1}>Latest</ToggleButton>
            <ToggleButton value={2}>View your own</ToggleButton>
          </ToggleButtonGroup>

          {/* <Button
            onClick={() => {
              setView(2);
            }}
          >
            View your own
          </Button> */}
        </Paper>
      )}

      {view == 0 && <Random />}
      {view == 1 && <Sorted />}
      {view == 2 && <YourOwn setView={setView} />}
    </>
  );
}
