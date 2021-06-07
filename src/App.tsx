import { Box, Container, Typography } from "@material-ui/core";
import React from "react";
import "./App.css";
import MasonryList from "./components/MasonryList";
import tiles from "./data";

function App() {
  return (
    <div className="App">
      <Container>
        <Box m={3}>
          <Typography variant="h2" component="h1">
            Getting Started with Image Engine in React
          </Typography>
        </Box>
        <section>
          <MasonryList tiles={tiles} />
        </section>
        <footer></footer>
      </Container>
    </div>
  );
}

export default App;
