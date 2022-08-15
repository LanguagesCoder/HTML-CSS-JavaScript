import React from "react"
import ReactDOM from "react-dom"
import App from "./App"

ReactDOM.render(
  <React.StrictMode>
    <BudgetsProvider>
      <App />
    </BudgetsProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
