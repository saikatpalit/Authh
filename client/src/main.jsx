import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);


//for approach 2

// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { BrowserRouter } from "react-router-dom";
// import { AppContextProvider } from "./context/AppContext.jsx";
// import { GoogleOAuthProvider } from "@react-oauth/google"; // ADD

// createRoot(document.getElementById("root")).render(
//   <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> {/* ADD */}
//     <BrowserRouter>
//       <AppContextProvider>
//         <App />
//       </AppContextProvider>
//     </BrowserRouter>
//   </GoogleOAuthProvider> // ADD
// );