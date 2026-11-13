import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

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

// Mirrors the pill-tab pattern used on the About page's "Our History"
// section: one row of rounded-full buttons, one section rendered at a time.
const GOV_TABS = [
  { key: 'executive', label: 'Executive' },
  { key: 'senators', label: 'Senators' },
  { key: 'representatives', label: 'Representatives' },
  { key: 'appointed', label: 'Appointed' },
  { key: 'committees', label: 'Committees' }
];

const asList = (res) => res.data.results || res.data || [];

const Government = () => {
  const [executive, setExecutive] = useState([]);
  const [senators, setSenators] = useState([]);
  const [representatives, setRepresentatives] = useState([]);
  const [appointed, setAppointed] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(GOV_TABS[0].key);
  const { hash } = useLocation();

  useEffect(() => {
    const load = (path, setter) =>
      api
        .get(path)
        .then((res) => setter(asList(res)))
        .catch(() => setter([]));

    Promise.all([
      load('/portal/executive/', setExecutive),
      load('/portal/senators/', setSenators),
      load('/portal/representatives/', setRepresentatives),
      load('/portal/appointed/', setAppointed),
      load('/portal/committees/', setCommittees)
    ]).finally(() => setLoading(false));
  }, []);

  // Representatives come back as a flat list; group them by `group`,
  // keeping the order they were entered in the admin.
  const repGroups = representatives.reduce((acc, r) => {
    let g = acc.find((x) => x.group === r.group);
    if (!g) {
      g = { group: r.group, members: [] };
      acc.push(g);
    }
    g.members.push(r.name);
    return acc;
  }, []);

  // Navbar links to /government#senators and /government#committees. Same
  // approach as About's HistoryTabs: pick up the hash and switch the active
  // tab to match, since only one section renders at a time now.
  useEffect(() => {
    const key = hash.replace('#', '');
    if (GOV_TABS.some((t) => t.key === key)) {
      setActive(key);
    }
  }, [hash]);

  const Empty = ({ children }) => (
    <p className="text-gray-500">{loading ? 'Loading…' : children}</p>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="eyebrow mb-3">The Government</div>
      <h1 className="text-3xl font-bold mb-2">EEMG Model Government</h1>
      <p className="text-gray-600 mb-10 max-w-2xl">
        Executive, senators, representatives, appointed officials, and committees of the EMA EMITS Model Government, A.Y. 2026-2027.
      </p>

      <div className="flex flex-wrap gap-2 mb-10">
        {GOV_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              active === t.key
                ? 'bg-primary-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Executive */}
      {active === 'executive' && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Executive</h2>
          {executive.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {executive.map((o) => (
                <div key={o.id} className="card-accent p-6">
                  <p className="text-xs font-bold tracking-wide uppercase text-primary-700 mb-1">{o.position}</p>
                  <p className="text-lg font-bold text-gray-900">{o.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <Empty>Executive officers will be announced soon.</Empty>
          )}
        </section>
      )}

      {/* Senators */}
      {active === 'senators' && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Senators</h2>
          {senators.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {senators.map((s) => (
                <div key={s.id} className="card py-3 px-4">
                  <p className="font-semibold text-gray-900">{s.name}</p>
                  {s.position && s.position !== 'senator' && s.position_display && (
                    <p className="text-xs text-primary-700 mt-0.5">{s.position_display}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Empty>Senators will be announced soon.</Empty>
          )}
        </section>
      )}

      {/* Representatives */}
      {active === 'representatives' && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Representatives</h2>
          {repGroups.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {repGroups.map((r) => (
                <div key={r.group} className="card-accent p-6">
                  <h3 className="font-bold text-primary-900">{r.group}</h3>
                  <NameList names={r.members} />
                </div>
              ))}
            </div>
          ) : (
            <Empty>Representatives will be announced soon.</Empty>
          )}
        </section>
      )}

      {/* Appointed */}
      {active === 'appointed' && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Appointed</h2>
          {appointed.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {appointed.map((o) => (
                <div key={o.id} className="card-accent p-6">
                  <p className="text-xs font-bold tracking-wide uppercase text-primary-700 mb-1">{o.position}</p>
                  <p className="text-lg font-bold text-gray-900">{o.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <Empty>Appointed officials will be announced soon.</Empty>
          )}
        </section>
      )}

      {/* Committees */}
      {active === 'committees' && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Committees</h2>
          {committees.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {committees.map((c) => {
                const roster = c.roster || [];
                const chair = roster.find((m) => m.is_chairperson)?.name;
                const names = roster.length > 0 ? roster.map((m) => m.name) : (c.members || []).map((m) => m.name);
                return (
                  <div key={c.id} className="card-accent p-6">
                    <h3 className="font-bold text-primary-900">{c.name}</h3>
                    {c.description && <p className="text-gray-600 mt-2 text-sm">{c.description}</p>}
                    {names.length > 0 && <NameList names={names} chair={chair} />}
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty>Committees will be announced soon.</Empty>
          )}
        </section>
      )}
    </div>
  );
};

export default Government;