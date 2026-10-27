import { useEffect } from "react";

import Sidebar from "../Layout/Sidebar";
import { useAuth } from "../Context/TerminalProvider";
import { useClock } from "../Context/useClock";


const Overview = () => {
 
  const {Terminaldata} = useAuth()
  console.log(Terminaldata)

const total = Terminaldata.length;
const count = (key, value) => Terminaldata.filter((t) => t[key] === value).length;
const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

 const android = count("platform", "Android");
  const linux = count("platform", "Linux");
  const online = count("status", "Online");
  const late = count("status", "Late");
  const offline = count("status", "Offline");


  const platformCards = [
    { label: "Total devices", value: total, note: "All registered terminals", color: "text-slate-900" },
    { label: "Android", value: android, note: `${pct(android)}% of fleet`, color: "text-indigo-600" },
    { label: "Linux", value: linux, note: `${pct(linux)}% of fleet`, color: "text-emerald-600" },
  ];

  const statusCards = [
    { label: "Online", value: online, note: "Called home within 15 min", color: "text-green-600", dot: "bg-green-500  animate-pulse" },
    { label: "Late", value: late, note: "Missed 1 call-home window", color: "text-yellow-600", dot: "bg-yellow-500  animate-pulse" },
    { label: "Offline", value: offline, note: "No call home for 45+ min", color: "text-red-600", dot: "bg-red-500  animate-pulse" },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      {/* Top bar */}
      <header className="fixed left-[180px] right-0 top-0 z-20 flex h-[80px] items-center justify-between border-b border-slate-200 shadow-md bg-white px-8">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Fleet overview</h1>
          <p className="text-sm text-slate-500">
            Android and Linux terminals reporting call-home data
          </p>
        </div>
        <p className="flex items-center gap-2 text-sm font-medium text-green-600">
        <span className="h-2 w-2 rounded-full bg-green-500  animate-pulse" />
         Current time: {useClock()}
        </p>
      </header>

    <main className="relative z-0 min-h-screen bg-gradient-to-b from-slate-500 to-slate-700 ml-[180px] min-w-0 space-y-6 px-8 pb-10 pt-[104px] before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[url('public/Cellcore-Logo.png')]  before:bg-no-repeat before:bg-bottom before:bg-[length:30%] before:pointer-events-none">
        {/* Platform row */}
        <section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {platformCards.map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/30"
              >
                <p className="text-sm font-medium text-slate-500">{c.label}</p>
                <p className={`mt-1 text-3xl font-semibold ${c.color}`}>{c.value}</p>
                <p className="mt-1 text-sm text-slate-400">{c.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Status row */}
        <section>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {statusCards.map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/30"
              >
                <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                  {c.label}
                </p>
                <p className={`mt-1 text-3xl font-semibold ${c.color}`}>{c.value}</p>
                <p className="mt-1 text-sm text-slate-400">{c.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Info note */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/30">
          <p className="font-semibold text-slate-900">Status is based on the last call home</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            Each device posts on a fixed interval (default 15 minutes). Online means the last post
            arrived inside that interval. Late means one interval was missed. Offline means three
            or more.
          </p>
        </section>
      </main>
      
    </div>
  );
};

export default Overview;