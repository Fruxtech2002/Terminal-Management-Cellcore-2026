import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Searchsort from "../Layout/SearchSort";
import Sidebar from "../Layout/Sidebar";
import { useAuth } from "../Context/TerminalProvider";
import Loading from "../Layout/Loading";
import { CSVLink } from "react-csv";

// outside the component so they aren't recreated on every render

const COLS = "grid grid-cols-[0.8fr_1.6fr_1fr_1fr_1.3fr_0.8fr_1fr_0.9fr] items-center gap-4 px-5";

const STATUS_STYLES = {
  Online: "bg-green-100 text-green-700 ring-green-600/20",
  Late: "bg-yellow-100 text-yellow-700 ring-yellow-600/20",
  Offline: "bg-gray-100 text-gray-700 ring-gray-600/20",
  Blocked: "bg-red-100 text-red-700 ring-red-600/20",
};

const DOT_STYLES = {
  Online: "bg-green-600",
  Late: "bg-yellow-600",
  Offline: "bg-gray-500",
  Blocked: "bg-red-600",
};


const HEADERS = ["S/N", "Device", "Platform", "Site", "Last call home", "Interval", "Status", "App version"];

const Activedevices = () => {

  const { searchdata,Terminaldata,searchtype, loading, setloading } = useAuth();
  const navigate = useNavigate();

  const Terminal = Terminaldata;

  function handleClick(id) {
    navigate(`/selecteddevice/${id}`);
  }

  const Visibleterminal = useMemo(() => {
    if (["Android", "Linux"].includes(searchtype))
      return Terminal.filter((t) => t.platform === searchtype && t.blocked !== true);

    if (["Online", "Late", "Offline"].includes(searchtype))
      return Terminal.filter((t) => t.status === searchtype && t.blocked !== true);

    if (["Blocked"].includes(searchtype))
       return Terminal.filter((t) => t.blocked === true);
      return Terminal;
  }, [searchtype, Terminaldata]);


  const filteredDevices = useMemo(() => {
    const q = searchdata.trim().toLowerCase();
    if (!q) return Visibleterminal;

    return Visibleterminal.filter((d) =>
      [d.name, d.id, d.site, d.platform]
        .filter((v) => v != null)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [Visibleterminal, searchdata]);

 const terminaldata = filteredDevices

  const terminalheaders = [
    {label: "Device", key: "name"},
    {label: "Platform", key: "platform"},
    {label: "Site", key: "site"},
    {label: "Last call home", key: "last_call_home"},
    {label: "Interval", key: "interval_minutes"},
    {label: "Status", key: "status"}
];

useEffect(() => {
  const timer = setTimeout(() => {
    setloading(false);
  }, 3000);

  return () => clearTimeout(timer);
}, [Terminaldata]);

const isLoading = loading === true

  return (
    <div className="relative z-0 min-h-screen bg-gradient-to-b from-slate-500 to-slate-700 before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[url('public/Cellcore-Logo.png')]  before:bg-no-repeat before:bg-[position:calc(50%+90px)_bottom] before:bg-[length:30%] before:pointer-events-none">
      <Sidebar />

      {/* Top bar */}
      <header className="fixed left-[180px] right-0 top-0 z-20 flex h-[80px] items-center justify-between border-b border-slate-200 shadow-md bg-white px-8">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Devices</h1>
          <p className="text-sm text-slate-500">
            Terminals that report call-home data to the server
          </p>
        </div>

        <CSVLink
        data={terminaldata}
        filename="Terminals"
        headers={terminalheaders}
         className="flex items-center h-9 rounded-lg bg-green-600 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600/40">
          Export
        </CSVLink>
      </header>

      {/* Content */}
      <main className="ml-[180px] min-w-0 px-8 pb-10 pt-[104px]">
        <div className="mb-4">
          <Searchsort />
        </div>

   {isLoading ? <Loading/> :  <div>
     <div className="max-h-[calc(100vh-320px)] overflow-x-auto overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/30">
          <div className="min-w-[900px]">
            {/* Header row */}
            <div
              className={`${COLS} sticky top-0 z-10 h-11 border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500`}
            >
              {HEADERS.map((h) => (
                <p key={h}>{h}</p>
              ))}
            </div>

            {/* Rows */}
            {filteredDevices.map((terminal, i) => {
              const displayStatus = terminal.blocked ? "Blocked" : terminal.status;

              return (
                <div
                  key={terminal.id}
                  onClick={() => handleClick(terminal.id)}
                  className={`${COLS} h-[56px] cursor-pointer border-b border-slate-100 text-sm transition-colors last:border-b-0 hover:shadow hover:bg-gray-50`}
                >
                  <p>{i + 1}</p>
                  <p className="truncate font-semibold text-slate-900">{terminal.name}</p>
                  <p className="text-slate-600">{terminal.platform}</p>
                  <p className="truncate text-slate-600">{terminal.site}</p>
                  <p className="text-slate-600">{terminal.last_call_home}</p>
                  <p className="text-slate-600">{terminal.interval_minutes} min</p>

                  {/* status */}
                  <span
                    className={`inline-flex w-[88px] items-center text-center gap-1.5 justify-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[displayStatus]}`}
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      {displayStatus !== "Blocked" && (
                        <span className={`status-ping absolute inline-flex h-full w-full rounded-full ${DOT_STYLES[displayStatus]}`} />
                      )}
                      <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${DOT_STYLES[displayStatus]}`} />
                    </span>
                    {displayStatus}
                  </span>

                  <p className="text-slate-600">{terminal.app_version}</p>
                </div>
              );
            })}

            {/* Empty state */}
            {filteredDevices.length === 0 && (
              <div className="py-16 text-center">
                <p className="font-medium text-slate-700">No devices found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Try a different search or clear the filter.
                </p>
              </div>
            )}
          </div>
        </div> 
        

        <p className="mt-3 text-sm text-slate-200">
          Showing {filteredDevices.length} out of {filteredDevices.length} devices. Select a row to
          open the call-home details.
        </p>
        </div>}
      </main>
    </div>
  );
};

export default Activedevices;