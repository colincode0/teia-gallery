import * as React from "react";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Paper } from "@mui/material";
import Random from "./Random";
import Sorted from "./Sorted";
import YourOwn from "./YourOwn";

export default function ToggleButtons() {
  const [view, setView] = React.useState("random");

  const handleView = (event: any, newView: any) => {
    setView(newView);
  };

  return (
    <>
      {/* <Paper elevation={3}>
        <ToggleButtonGroup value={setView} exclusive onChange={handleView}>
          <ToggleButton value="random">Random</ToggleButton>
          <ToggleButton value="latest">Latest</ToggleButton>
          <ToggleButton value="yours">Your own</ToggleButton>
        </ToggleButtonGroup>
      </Paper> */}
      {/* {view === "random" && <Random />}
      {view === "latest" && <Sorted />}
      {view === "yours" && <YourOwn />} */}
      <YourOwn />
    </>
  );
}
