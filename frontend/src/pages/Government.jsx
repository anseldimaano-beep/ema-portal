import React, { useEffect, useState } from 'react';
import api from '../services/api';

const SenatorCard = ({ senator }) => (
  <div className="card text-center">
    {senator.photo ? (
      <img
        src={senator.photo}
        alt={senator.name}
        className="h-24 w-24 rounded-full object-cover mx-auto mb-3"
      />
    ) : (
      <div className="h-24 w-24 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
        {senator.name.charAt(0)}
      </div>
    )}
    <h3 className="font-bold">{senator.name}</h3>
    <p className="text-primary-800 text-sm font-medium">{senator.position_display}</p>
    {senator.department && <p className="text-gray-500 text-sm">{senator.department}</p>}
    {senator.term && <p className="text-gray-400 text-xs mt-1">Term {senator.term}</p>}
    {senator.bio && <p className="text-gray-600 text-sm mt-3">{senator.bio}</p>}
  </div>
);

const CommitteeCard = ({ committee }) => (
  <div className="card">
    <h3 className="font-bold text-lg text-primary-900">{committee.name}</h3>
    {committee.description && <p className="text-gray-600 mt-2">{committee.description}</p>}
    {committee.chairperson && (
      <p className="text-sm text-gray-500 mt-3">
        <span className="font-medium text-gray-700">Chairperson:</span> {committee.chairperson.name}
      </p>
    )}
    {committee.members?.length > 0 && (
      <p className="text-sm text-gray-500 mt-1">
        <span className="font-medium text-gray-700">Members:</span>{' '}
        {committee.members.map((m) => m.name).join(', ')}
      </p>
    )}
  </div>
);

const Government = () => {
  const [senators, setSenators] = useState([]);
  const [committees, setCommittees] = useState([]);

  useEffect(() => {
    api
      .get('/portal/senators/')
      .then((res) => setSenators(res.data.results || res.data || []))
      .catch(() => setSenators([]));

    api
      .get('/portal/committees/')
      .then((res) => setCommittees(res.data.results || res.data || []))
      .catch(() => setCommittees([]));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">EEMG Model Government</h1>
      <p className="text-gray-600 mb-10 max-w-2xl">
        Meet the senators and committees of the EMA EMITS Model Government.
      </p>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Senators</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {senators.map((s) => (
            <SenatorCard key={s.id} senator={s} />
          ))}
          {senators.length === 0 && <p className="text-gray-500">No senators listed yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Committees</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {committees.map((c) => (
            <CommitteeCard key={c.id} committee={c} />
          ))}
          {committees.length === 0 && <p className="text-gray-500">No committees listed yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default Government;
