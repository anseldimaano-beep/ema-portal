import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import programs from '../data/programs';

const ProgramDetail = () => {
  const { slug } = useParams();
  const program = programs.find((p) => p.slug === slug);

  if (!program) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Program not found</h1>
        <Link to="/academics" className="text-primary-800 font-medium">
          Back to Academics
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-primary-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/academics" className="inline-flex items-center gap-1 text-primary-200 text-sm mb-4 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Academics
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wide text-primary-300">
            {program.department}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">{program.name}</h1>
          <p className="text-primary-100 mt-2">{program.summary}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-3">About the Program</h2>
          <p className="text-gray-600 mb-8">{program.description}</p>

          <h2 className="text-xl font-bold mb-3">Program Highlights</h2>
          <ul className="space-y-2">
            {program.highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-gray-700">
                <CheckCircle className="h-5 w-5 text-primary-700 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="card h-fit">
          <h3 className="font-bold mb-3">Career Paths</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            {program.careers.map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
          <Link to="/register" className="btn-primary w-full text-center block mt-6">
            Apply / Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
