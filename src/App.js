import React from "react";
import { GlobalContextProvider } from "./common/GlobalContext";
import { Card } from "@mui/material";
import MainGrid from "./MainGrid";
import "./App.css";
import Actors from "./Actors";
import { AppContextProvider } from "./AppContext";

function App() {
  return (
    <GlobalContextProvider>
      <AppContextProvider>
        <Card sx={{ height: "100vh", width: "100vw" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            }}
          >
            <Actors />
            <div style={{ width: "100%", height: "95%" }}>
              <MainGrid />
            </div>
          </div>
        </Card>
      </AppContextProvider>
    </GlobalContextProvider>
  );
}

export default App;
