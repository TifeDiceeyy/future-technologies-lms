import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter as BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AppProvider } from "./store/AppContext.tsx";
import { AuthProvider } from "./store/AuthContext.tsx";
import { configureAmplify } from "./config/aws.ts";

// Bootstrap Amplify before anything renders
configureAmplify();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
