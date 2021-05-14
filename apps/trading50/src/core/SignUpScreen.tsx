import React, { useEffect } from "react";
import { DButton, DContainer, DText } from "../components/basic";
import { dlog } from "../libs/dlog";
import { TProps } from "../screens/types";

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
      <DText>Create a new Account</DText>
      <DButton />
    </DContainer>
  );
};