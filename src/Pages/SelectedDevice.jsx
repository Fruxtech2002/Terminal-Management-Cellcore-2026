import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Ban, Pencil } from "lucide-react";
import { useAuth } from "../Context/TerminalProvider";
import Sidebar from "../Layout/Sidebar";
import Editpage from "../Layout/Editpage";
import Blocking from "../Layout/Blocking";

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

const infoCard =
  "flex flex-col justify-center px-4 h-[64px] bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-900/30";

const SelectedDevice = () => {
  const { Terminaldata, loading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Local UI state: destroyed when you leave the page, so it can't leak
  const [blocked, setblocked] = useState(false);
  const [editactive, seteditactive] = useState(false);

  const selectedterminal = Terminaldata.find((t) => t.id === id);

  const isBlocked = selectedterminal?.blocked === true;
  const displayStatus = isBlocked ? "Blocked" : selectedterminal?.status;

  const pageBg =
    "relative z-0 min-h-screen pb-44 bg-gradient-to-b from-slate-500 to-slate-700 before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[url('/Cellcore-Logo.png')] before:bg-no-repeat before:bg-[position:calc(50%+90px)_bottom] before:bg-[length:30%] before:pointer-events-none";

  if (loading || !selectedterminal) {
    return (
      <div className={pageBg}>
        <Sidebar />
        <div className="ml-[180px] p-10 text-white">
          {loading ? "Loading device..." : "Device not found."}
          {!loading && (
            <button
              type="button"
              onClick={() => navigate("/devices")} // use your actual list route
              className="ml-3 underline"
            >
              Back to devices
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={pageBg}>
      <Sidebar />

      {editactive ? (
        <Editpage onClose={() => seteditactive(false)} />
      ) : (
        <div className="ml-[180px] pl-6 min-w-0 flex-1 mr-[30px]">
          {/* Header */}
          <div className="bg-white h-[80px] border-b border-slate-200 shadow-md px-8 fixed left-[180px] top-0 right-0 z-20 flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() =>
                  window.history.length > 1 ? navigate(-1) : navigate("/devices")
                }
                className="group mb-1 inline-flex items-center gap-1 rounded-md py-0.5 pr-2 text-sm font-medium text-slate-500 transition-colors hover:text-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 active:scale-95"
              >
                <svg
                  className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <p className="text-xs text-slate-500">
                Devices / <span className="text-slate-700">{selectedterminal.name}</span>
              </p>
              <p className="text-lg font-bold leading-tight text-slate-900">
                {selectedterminal.name}
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <span
                className={`inline-flex w-[88px] h-[30px] items-center text-center gap-1.5 justify-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[displayStatus]}`}
              >
                <span className="relative flex h-2 w-2">
                  {!isBlocked && (
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${DOT_STYLES[displayStatus]}`}
                    />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${DOT_STYLES[displayStatus]}`}
                  />
                </span>
                {displayStatus}
              </span>

              <button
                type="button"
                onClick={() => setblocked(true)}
                className="flex h-10 cursor-pointer select-none items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-white px-4 text-sm font-semibold text-red-600 transition-colors hover:border-red-600 hover:bg-red-600 hover:text-white active:scale-95"
              >
                <Ban className="h-4 w-4" />
                <span>{isBlocked ? "Unblock" : "Block"}</span>
              </button>
            </div>
          </div>

          {/* Body */}
          <div>
            <div className="grid grid-cols-4 gap-4 pt-28">
              <div className={infoCard}>
                <p className="text-xs text-slate-500">Device ID</p>
                <p className="text-[16px] font-semibold text-slate-900">{selectedterminal.id}</p>
              </div>
              <div className={infoCard}>
                <p className="text-xs text-slate-500">Platform</p>
                <p className="text-[16px] font-semibold text-slate-900">{selectedterminal.platform}</p>
              </div>
              <div className={infoCard}>
                <p className="text-xs text-slate-500">Site</p>
                <p className="text-[16px] font-semibold text-slate-900">{selectedterminal.site}</p>
              </div>
              <div className={infoCard}>
                <p className="text-xs text-slate-500">App version</p>
                <p className="text-[16px] font-semibold text-slate-900">{selectedterminal.app_version}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-4">
              <div className={infoCard}>
                <p className="text-xs text-slate-500">OS</p>
                <p className="text-[16px] font-semibold text-slate-900">{selectedterminal.os}</p>
              </div>

              <div className="flex h-[64px] items-center justify-between rounded-xl border border-slate-200 bg-white px-4 shadow-xl shadow-slate-900/30">
                <div className="flex flex-col">
                  <p className="text-xs text-slate-500">Call home interval</p>
                  <p className="text-[16px] font-semibold text-slate-900">
                    {selectedterminal.interval_minutes}
                    <span className="ml-1 text-sm font-normal text-slate-500">min</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => seteditactive(true)}
                  className="inline-flex h-8 cursor-pointer select-none items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-600 transition-colors hover:border-green-600 hover:bg-green-50 hover:text-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 active:scale-95"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              </div>

              <div className={infoCard}>
                <p className="text-xs text-slate-500">Last Call Home</p>
                <p className="text-[16px] font-semibold text-slate-900">{selectedterminal.last_call_home}</p>
              </div>
              <div className={infoCard}>
                <p className="text-xs text-slate-500">Site</p>
                <p className="text-[16px] font-semibold text-slate-900">{selectedterminal.site}</p>
              </div>
            </div>
          </div>

          {/* Call-home history */}
          <div className="mt-6 mb-10 overflow-hidden bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-900/30">
            <p className="flex items-center px-5 h-[48px] text-sm font-semibold text-slate-900 border-b border-slate-200">
              Call-home history
            </p>

            <div className="grid grid-cols-4 items-center gap-4 px-5 h-[40px] text-start text-xs font-semibold uppercase tracking-wide text-slate-500 bg-slate-50 border-b border-slate-200">
              <p>Time</p>
              <p>Result</p>
              <p>Battery</p>
              <p>Network</p>
            </div>

            {selectedterminal.history?.map((data, i) => (
              <div
                key={i}
                className="grid grid-cols-4 items-center gap-4 px-5 h-[50px] text-start text-sm border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <p className="font-medium text-slate-900">{data.time || "----"}</p>
                <p
                  className={
                    data.result === "Received"
                      ? "font-medium text-green-600"
                      : "font-medium text-red-600"
                  }
                >
                  {data.result || "----"}
                </p>
                <p className="text-slate-500">
                  {data.battery !== null && data.battery !== undefined ? `${data.battery}%` : "----"}
                </p>
                <p className="text-slate-500">{data.network || "----"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {blocked && <Blocking onClose={() => setblocked(false)} />}
    </div>
  );
};

export default SelectedDevice;