import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("API URL =", process.env.REACT_APP_API_URL);
  }, []);

  return <h1>Finance Tracker</h1>;
}

export default App;