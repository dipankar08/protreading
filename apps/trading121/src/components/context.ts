import React from "react";
type AuthCallBack = { signIn: () => void; signUp: () => void; signOut: () => void };

export const AuthContext = React.createContext<AuthCallBack>({
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
});
