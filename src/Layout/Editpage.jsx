import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../Context/TerminalProvider";
import ConfirmationPage from "./ConfirmationPage";

const QUICK_PICKS = [5, 10, 15, 30, 60];

const Editpage = ({ onClose }) => {
  const { id } = useParams();
  const { Terminaldata } = useAuth();

  const [confirmedit, setconfirmedit] = useState(false);
  const selectedterminal = Terminaldata.find((t) => t.id === id);
  const [minvalue, setminvalue] = useState(selectedterminal?.interval_minutes ?? "");

  if (!selectedterminal) return null; 

  function handleEdit() {
    const num = Number(minvalue);
    if (!Number.isInteger(num) || num < 1 || num > 1440) {
      toast.error("Interval must be a whole number from 1 to 1440");
      return;
    }
    setconfirmedit(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
      <div
        className={`relative z-10 ${confirmedit ? "hidden" : "flex"} max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 text-stone-900 shadow-xl sm:p-10`}
      >
        <div className="mb-6">
          <p className="text-2xl font-bold leading-tight">Edit call home interval</p>
          <p className="mt-2 text-base leading-normal text-stone-600">
            How often this device checks in with the server.
          </p>
        </div>
        <p className="mb-6 h-px w-full bg-stone-200" />

        <div className="flex justify-between gap-3">
          <div className="flex h-16 min-w-0 flex-1 flex-col justify-center rounded-xl border border-stone-200 bg-stone-50 px-4">
            <p className="text-[13px] font-medium text-stone-600">Device ID</p>
            <p className="truncate text-base font-semibold text-stone-900">{selectedterminal.id}</p>
          </div>
          <div className="flex h-16 min-w-0 flex-1 flex-col justify-center rounded-xl border border-stone-200 bg-stone-50 px-4">
            <p className="text-[13px] font-medium text-stone-600">Site</p>
            <p className="truncate text-base font-semibold text-stone-900">{selectedterminal.name}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-stone-900">Call home interval</p>
          <div className="relative flex">
            <input
              className="mt-2 h-12 w-full rounded-[10px] border-[1.5px] border-stone-400 bg-white px-4 pr-24 text-base text-stone-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
              value={minvalue}
              inputMode="numeric"
              onChange={(e) => setminvalue(e.target.value)}
            />
            <p className="pointer-events-none absolute right-2 top-3.5 flex h-9 w-[80px] items-center justify-center rounded-md bg-stone-100 text-sm font-medium text-stone-600">
              minutes
            </p>
          </div>
          <p className="mt-2 text-sm leading-snug text-stone-600">
            Allowed range: 1 to 1440 minutes. Takes effect on the next call home.
          </p>
        </div>

        <div className="mt-6 flex flex-col">
          <p className="mb-3 text-sm font-medium text-stone-600">Quick pick</p>
          <div className="flex items-center gap-2 text-center">
            {QUICK_PICKS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setminvalue(n)}
                className={`flex h-10 w-12 cursor-pointer select-none items-center justify-center rounded-full border text-sm font-medium transition ${
                  Number(minvalue) === n
                    ? "border-blue-700 bg-blue-50 text-blue-700"
                    : "border-stone-300 text-stone-700 hover:bg-stone-100"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 cursor-pointer select-none items-center justify-center rounded-[10px] border-[1.5px] border-stone-900 bg-white px-6 text-base font-medium text-stone-900 hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className="flex h-12 cursor-pointer select-none items-center justify-center rounded-[10px] border-[1.5px] border-blue-700 bg-blue-700 px-6 text-base font-medium text-white hover:bg-blue-800"
          >
            Save interval
          </button>
        </div>
      </div>

      {confirmedit && (
        <ConfirmationPage
          newValue={Number(minvalue)}
          onKeepEditing={() => setconfirmedit(false)}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default Editpage;