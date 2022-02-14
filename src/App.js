import React, { useState } from "react";
import { GlobalContextProvider } from "./common/GlobalContext";
import { Card } from "@mui/material";
import TextInput from "./common/TextInput";
import Aggrid from "./Aggrid";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <GlobalContextProvider>
      <Card sx={{ height: "100vh", width: "100vw" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "calc(100% - 10px)",
              height: "5%",
              padding: "20px 5px",
            }}
          >
            <TextInput
              label="Search"
              id="search"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              // InputProps={{
              //   readOnly: true,
              // }}
              value={searchTerm}
              placeholder="Enter Search Term"
            />
          </div>
          <div style={{ width: "100%", height: "95%" }}>
            <Aggrid />
          </div>
        </div>
      </Card>
    </GlobalContextProvider>
  );
}

export default App;
