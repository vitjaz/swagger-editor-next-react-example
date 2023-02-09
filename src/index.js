import React from "react";
import ReactDOM from 'react-dom';
import "./index.css";
import App from "./App";

window.self.MonacoEnvironment = {
  /**
   * We're building into the dist/ folder. When application starts on
   * URL=https://example.com then SwaggerEditor will look for
   * `apidom.worker.js` on https://example.com/static/js/apidom.worker.js and
   * `editor.worker` on https://example.com/static/js/editor.worker.js.
   */
  baseUrl: `${document.baseURI || window.location.href}static/js/`,
};

ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, document.getElementById("root"));
