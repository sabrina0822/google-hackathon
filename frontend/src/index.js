import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDs_OKXWDe5pnMZbqkXXpk6qd0j9z7CN0Q",
  authDomain: "itinerary-hackathon.firebaseapp.com",
  projectId: "itinerary-hackathon",
  storageBucket: "itinerary-hackathon.appspot.com",
  messagingSenderId: "138358958822",
  appId: "1:138358958822:web:7444867e19db1abe5de927",
  measurementId: "G-NKJ924HJJ8",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
