import React from "react";

export default function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>Date: {task.date}</p>
      <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
        {task.status}
      </span>
    </div>
  );
}