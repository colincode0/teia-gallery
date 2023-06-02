import React, { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Box, Button, Paper } from "@mui/material";
import Random from "./Random";
import Sorted from "./Sorted";
import YourOwn from "./YourOwn";
import router, { useRouter } from "next/router";

export default function ToggleButtons() {
  const router = useRouter();
  const [view, setView] = useState(0);

  const handleView = (event: any, newValue: any) => {
    setView(newValue);
    if (newValue === 2) {
      router.push("/");
    }
  };

  return (
    <>
      {view != 2 && (
        <Paper
          elevation={3}
          sx={{ mb: 4, border: "1px solid #888", background: "#222" }}
        >
          <ToggleButtonGroup value={view} exclusive onChange={handleView}>
            <ToggleButton
              value={0}
              sx={{
                color: view === 0 ? "#000" : "#888",
              }}
            >
              Random
            </ToggleButton>
            <ToggleButton
              value={1}
              sx={{
                color: view === 1 ? "#000" : "#888",
              }}
            >
              Latest
            </ToggleButton>
            <ToggleButton
              value={2}
              sx={{
                color: view === 2 ? "#000" : "#888",
              }}
            >
              View your own
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>
      )}

      {view == 0 && <Random />}
      {view == 1 && <Sorted />}
      {view == 2 && <YourOwn setView={setView} />}
    </>
  );
}
