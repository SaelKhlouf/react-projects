import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./components/App";
import { QuizProvider } from "./contexts/QuizContext";
import "./App.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuizProvider>
      <App />
    </QuizProvider>
  </StrictMode>,
)
