import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

window.self.MonacoEnvironment = {
  /**
   * We're building into the dist/ folder. When application starts on
   * URL=https://example.com then SwaggerEditor will look for
   * `apidom.worker.js` on https://example.com/dist/apidom.worker.js and
   * `editor.worker` on https://example.com/dist/editor.worker.js.
   */
  baseUrl: `${document.baseURI || window.location.href}/dist/`,
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
