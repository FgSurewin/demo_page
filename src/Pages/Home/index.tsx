import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Button component={RouterLink} variant={"contained"} to="/chatgpt">
        ChatGPT
      </Button>
      <p>-----------------</p>
      <Button component={RouterLink} variant={"contained"} to="/url">
        URL
      </Button>
    </div>
  );
}
