import { useMemo } from "react";
import { useAuth } from "../Context/TerminalProvider";

const FILTERS = ["All", "Android", "Linux", "Online", "Late", "Offline", "Blocked"];

const Searchsort = () => {

  const {searchdata, setsearchdata, searchtype, setsearchtype} = useAuth();

  return (
    <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center">
      <input
          value={searchdata}
          onChange={(e) => setsearchdata(e.target.value)}
          placeholder="Search device, site, or ID"
          className="w-full md:w-[890px] max-w-full min-w-0 rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm
                    placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
       />
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = searchtype === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setsearchtype(f)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                active
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Searchsort;