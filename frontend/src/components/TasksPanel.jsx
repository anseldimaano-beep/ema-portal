import React from 'react';

// Right-hand rail shown next to the dashboard, matching the reference design.
const TasksPanel = ({ tasks = [] }) => (
  <aside className="w-72 shrink-0 bg-yellow-50 border-l border-gray-200 p-6 hidden lg:block">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">Tasks</h2>
    {tasks.length === 0 ? (
      <p className="text-gray-400">No tasks assigned.</p>
    ) : (
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="text-sm text-gray-700 bg-white rounded-md shadow-sm p-3">
            {task.title}
          </li>
        ))}
      </ul>
    )}
  </aside>
);

export default TasksPanel;
