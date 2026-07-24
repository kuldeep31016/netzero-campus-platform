import React, { useMemo, useState } from 'react';
import { BUILDINGS, UNPLACED_DEPARTMENTS } from '../data/campusBuildings';

const CampusDirectory: React.FC = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BUILDINGS;
    return BUILDINGS.filter(
      (b) =>
        String(b.number).includes(q) ||
        b.departments.some((d) => d.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-ink-900">Campus Directory</h3>
          <p className="text-sm text-ink-500">Dayananda Sagar Institutions — {BUILDINGS.length} numbered blocks</p>
        </div>
        <div className="relative w-full max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search block or department…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-ink-200 bg-white text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
        {filtered.map((b) => (
          <div
            key={b.number}
            className="flex items-start gap-3 rounded-lg border border-ink-200 bg-white px-4 py-3 transition-colors hover:border-primary-300"
          >
            <span className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-md bg-primary-50 text-primary-700 text-sm font-semibold">
              {b.number}
            </span>
            <div className="min-w-0">
              {b.departments.map((d) => (
                <div key={d} className="text-sm text-ink-800 leading-snug">
                  {d}
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-sm text-ink-400">
            No block or department matches “{query}”.
          </div>
        )}
      </div>

      {UNPLACED_DEPARTMENTS.length > 0 && (
        <div className="mt-5 rounded-lg border border-dashed border-ink-200 bg-ink-50/60 px-4 py-3">
          <p className="text-xs font-medium text-ink-500 mb-1.5">
            Listed on the signboard but not yet mapped to a block number:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {UNPLACED_DEPARTMENTS.map((d) => (
              <span key={d} className="text-xs rounded-full bg-white border border-ink-200 px-2.5 py-1 text-ink-600">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusDirectory;
