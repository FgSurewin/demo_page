import React from "react";
import "./index.css";
import App from "./App";
import Home from "./Pages/Home";
import URLPage from "./Pages/URLPage";
import ReactDOM from "react-dom/client";
import ChatGPTPage from "./Pages/ChatGPTPage";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/chatgpt" element={<ChatGPTPage />} />
          <Route path="/url" element={<URLPage />} />
          <Route path="*" element={<h1>404</h1>} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
