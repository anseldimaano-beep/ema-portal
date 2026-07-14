import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

// A.Y. 2026-2027 roster, names only. Used as a fallback whenever the API
// has no records yet, so the page isn't empty before the backend is seeded.
const OFFICERS = [
  { title: 'President', name: 'Glendel I. Manipol' },
  { title: 'Vice President', name: 'Vincent De Mesa' }
];

const SENATORS = [
  'Manalo, Zandro',
  'Bayhon, Jamailah',
  'Villa, Kate Angela',
  'Sales, Regielyn',
  'Rafol, John Philip',
  'Recaro, Benedict',
  'Francisco, Joshua',
  'Matining, Bryan',
  'Tan, Princess',
  'Cabatian, Milky',
  'Marayan, Nathan Rein',
  'Verdadero, Angela'
];

const REPRESENTATIVES = [
  { group: 'CBM Representatives', members: ['Avelino, Kane Lee', 'Malubag, Jennelyn'] },
  { group: 'CCS Representatives', members: ['Sadicon, Marishel Ayesha', 'Sotto, Kristine Joy'] },
  { group: 'CTE Representatives (Secondary)', members: ['Oliver, Rencel Jake', 'Paner, Benedict', 'Regalario, Shaira'] },
  { group: 'CTE Representatives (Elementary)', members: ['Florencondia, Marian', 'Sabalvaro, Angelica'] },
  { group: 'CHM Representatives', members: ['Mercado, Charisse', 'Reyes, Mary Jane'] }
];

const COMMITTEES = [
  { name: 'Finance', chair: 'Manalo, Zandro', members: ['Manalo, Zandro', 'Brucal, Jana Mae', 'Malubag, Jennelyn', 'Abel, Nicole'] },
  {
    name: 'Security & Safety',
    chair: 'Matining, Bryan',
    members: ['Matining, Bryan', 'Matining, Aeron', 'Mercado, Charisse', 'Manalon, Jericho', 'Oliver, Rencel Jake']
  },
  {
    name: 'Waste & Classroom Management',
    chair: 'Recaro, Benedict',
    members: ['Recaro, Benedict', 'Avelino, Kane Lee', 'Verdadero, Angela', 'Sabalvaro, Angelica']
  },
  {
    name: 'Media',
    chair: 'Bayhon, Jamailah',
    members: ['Bayhon, Jamailah', 'Dimaapi, Ansel John', 'Cabatian, Milky', 'Sadicon, Marishel Ayesha', 'Reyes, Mary Jane']
  },
  {
    name: 'Rules & Regulations and By-Laws',
    chair: 'Sales, Regielyn',
    members: ['Sales, Regielyn', 'Regalario, Shaira', 'Paner, Benedict', 'Villa, Kate Angela']
  },
  {
    name: 'Events',
    chair: 'Rafol, John Philip',
    members: [
      'Rafol, John Philip',
      'Fransisco, Joshua',
      'Marayan, Nathan Rein',
      'Tan, Princess',
      'Harper, Jaz Xavier',
      'Sotto, Kristine Joy',
      'Florencondia, Marian'
    ]
  }
];

const NameList = ({ names, chair }) => (
  <ul className="mt-3 space-y-1.5">
    {names.map((n) => {
      const isChair = chair && n === chair;
      return (
        <li
          key={n}
          className={`text-sm flex items-start gap-2 ${
            isChair ? 'font-bold text-primary-900' : 'text-gray-700'
          }`}
        >
          <span className={isChair ? 'text-accent-600 mt-1' : 'text-accent-500 mt-1'}>&#9733;</span>
          <span>
            {n}
            {isChair && (
              <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-wide bg-accent-100 text-accent-800 px-2 py-0.5 rounded-full">
                Chairperson
              </span>
            )}
          </span>
        </li>
      );
    })}
  </ul>
);

const Government = () => {
  const [senators, setSenators] = useState([]);
  const [committees, setCommittees] = useState([]);
  const { hash } = useLocation();

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

  // React Router doesn't auto-scroll to a #hash target on client-side
  // navigation (only real browser page loads do that), so do it manually
  // once the target section has rendered.
  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, [hash]);

  // Prefer live API data once the backend is seeded; otherwise show the
  // A.Y. 2026-2027 roster as-is.
  const hasApiSenators = senators.length > 0;
  const hasApiCommittees = committees.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="eyebrow mb-3">The Government</div>
      <h1 className="text-3xl font-bold mb-2">EEMG Model Government</h1>
      <p className="text-gray-600 mb-10 max-w-2xl">
        Officers, senators, representatives, and committees of the EMA EMITS Model Government, A.Y. 2026-2027.
      </p>

      {/* Officers */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Officers</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {OFFICERS.map((o) => (
            <div key={o.title} className="card-accent p-6">
              <p className="text-xs font-bold tracking-wide uppercase text-primary-700 mb-1">{o.title}</p>
              <p className="text-lg font-bold text-gray-900">{o.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Senators */}
      <section id="senators" className="mb-16 scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6">Senators</h2>
        {hasApiSenators ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {senators.map((s) => (
              <div key={s.id} className="card py-3 px-4">
                <p className="font-semibold text-gray-900">{s.name}</p>
                {s.position_display && <p className="text-xs text-primary-700 mt-0.5">{s.position_display}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SENATORS.map((name) => (
              <div key={name} className="card py-3 px-4">
                <p className="font-semibold text-gray-900">{name}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Representatives */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Representatives</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPRESENTATIVES.map((r) => (
            <div key={r.group} className="card-accent p-6">
              <h3 className="font-bold text-primary-900">{r.group}</h3>
              <NameList names={r.members} />
            </div>
          ))}
        </div>
      </section>

      {/* Committees */}
      <section id="committees" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6">Committees</h2>
        {hasApiCommittees ? (
          <div className="grid md:grid-cols-2 gap-6">
            {committees.map((c) => (
              <div key={c.id} className="card-accent p-6">
                <h3 className="font-bold text-lg text-primary-900">{c.name}</h3>
                {c.description && <p className="text-gray-600 mt-2 text-sm">{c.description}</p>}
                {c.members?.length > 0 && <NameList names={c.members.map((m) => m.name)} />}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMITTEES.map((c) => (
              <div key={c.name} className="card-accent p-6">
                <h3 className="font-bold text-primary-900">{c.name}</h3>
                <NameList names={c.members} chair={c.chair} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Government;