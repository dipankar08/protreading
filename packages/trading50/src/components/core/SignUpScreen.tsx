import React, { useEffect } from "react";
import { TProps } from "../../screens/types";
import { DContainer } from "../DLayout";
import { DTextTitle } from "../DText";
import { dlog } from "../libs/dlog";

// Sign up logic...
export const SignUpScreen = ({ navigation }: TProps) => {
  let name = "SignUp";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);
  return (
    <DContainer>
      <DTextTitle>Create a new Account</DTextTitle>
    </DContainer>
  );
};
