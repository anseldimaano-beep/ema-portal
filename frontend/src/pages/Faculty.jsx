import React from 'react';
import programs from '../data/programs';

// No public faculty-directory endpoint exists on the backend yet, so this
// is a static placeholder grouped by department. Swap in real
// faculty names/photos/titles, or wire this up to a real API endpoint
// once one exists.
const placeholderFaculty = {
  'College of Computer Studies': [{ name: 'Add faculty name', title: 'Program Head, BSCS' }],
  'College of Education': [{ name: 'Add faculty name', title: 'Program Head, BEED' }],
  'College of Business Administration': [{ name: 'Add faculty name', title: 'Program Head, BSBA' }],
  'College of Hospitality Management': [{ name: 'Add faculty name', title: 'Program Head, BSHM' }],
};

const Faculty = () => (
  <div className="max-w-6xl mx-auto px-4 py-16">
    <h1 className="text-3xl font-bold mb-2">Faculty</h1>
    <p className="text-gray-600 mb-10 max-w-2xl">
      Meet the faculty of EMA EMITS College, organized by department.
    </p>

    {programs
      .map((p) => p.department)
      .filter((dept, i, arr) => arr.indexOf(dept) === i)
      .map((department) => (
        <div key={department} className="mb-10">
          <h2 className="text-lg font-bold mb-4 text-primary-900">{department}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {(placeholderFaculty[department] || []).map((f, i) => (
              <div key={i} className="card">
                <h3 className="font-bold">{f.name}</h3>
                <p className="text-gray-500 text-sm">{f.title}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
  </div>
);

export default Faculty;
