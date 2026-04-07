
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import { initAxiosClient } from "./api/axiosClient";
import reportWebVitals from "./reportWebVitals";


initAxiosClient().then(() => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <>
      <Router>
        <App />
      </Router>
    </>,
  );
});

reportWebVitals();
