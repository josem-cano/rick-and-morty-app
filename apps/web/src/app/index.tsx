import * as React from "react";
import { AuthProvider } from "./context/auth.context.tsx";
import Routes from "./routes";

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
