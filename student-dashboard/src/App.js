import React from "react";

function App() {
  const subjects = [
    { name: "Mathematics", progress: "82%", status: "On Track" },
    { name: "Computer Science", progress: "91%", status: "Excellent" },
    { name: "Physics", progress: "74%", status: "Improving" },
    { name: "English", progress: "88%", status: "Strong" }
  ];

  return (
    <div>
      <h1>Student Dashboard</h1>

      <p>
        Welcome to the frontend container deployed through Continuous Deployment.
      </p>

      <ul>
        {subjects.map((s, index) => (
          <li key={index}>
            {s.name} - {s.progress} - {s.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;