import Button from "@material-ui/core/Button";
import React from "react";
import { DCol } from "../components/DLayout";

export const LandingPageScreen = () => {
  return (
    <DCol>
      <p>Hello</p>
      <Button variant="contained" color="primary">
        Primary
      </Button>
    </DCol>
  );
};
