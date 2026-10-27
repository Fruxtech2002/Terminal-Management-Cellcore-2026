import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Ban, ShieldCheck } from "lucide-react";
import { useAuth } from "../Context/TerminalProvider";
import Customreasondrop from "./Customreasondrop";

const Blocking = ({ onClose }) => {
  const { id } = useParams();
  const { Terminaldata, setTerminaldata } = useAuth();

  const [confirmId, setconfirmId] = useState("");
  const [iderrormessage, setiderrormessage] = useState(null);
  const [submitting, setsubmitting] = useState(false);

  // Escape closes the dialog, so it can never be a dead end
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const selectedterminal = Terminaldata.find((t) => t.id === id);
  if (!selectedterminal) return null; // keep this after all hooks

  const isBlocked = selectedterminal.blocked === true;
  const isCorrectid = confirmId === selectedterminal.id;

  async function updateBlocked(nextBlocked) {
    if (!isCorrectid) {
      setiderrormessage("Please enter the correct Terminal ID");
      return;
    }
    setiderrormessage(null);
    setsubmitting(true);

    try {
      const res = await fetch(`http://localhost:3002/devices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked: nextBlocked }),
      });

      if (!res.ok) throw new Error("Update failed");

      setTerminaldata((prev) =>
        prev.map((t) => (t.id === id ? { ...t, blocked: nextBlocked } : t))
      );
      toast.success(`${selectedterminal.id} ${nextBlocked ? "blocked" : "unblocked"}`);
      onClose(); // close only on success so a failed attempt can be retried
    } catch (err) {
      console.error(err);
      toast.error(`Couldn't ${nextBlocked ? "block" : "unblock"} the device. Try again.`);
    } finally {
      setsubmitting(false);
    }
  }

  const actionBtn = isBlocked
    ? "bg-green-600 hover:bg-green-700 focus-visible:outline-green-600"
    : "bg-red-600 hover:bg-red-700 focus-visible:outline-red-600";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-10 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              isBlocked ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {isBlocked ? <ShieldCheck className="h-5 w-5" /> : <Ban className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <p className="break-words text-lg font-bold leading-tight text-slate-900">
              {isBlocked ? "Unblock" : "Block"} {selectedterminal.id}
            </p>
            <p className="mt-1 text-sm leading-snug text-slate-500">
              {isBlocked
                ? "This device will be able to call home again once you unblock it."
                : "This device will be cut off from Terminal Monitor until someone unblocks it."}
            </p>
          </div>
        </div>

        {/* Device details */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:grid-cols-4">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Device ID</p>
            <p className="truncate text-sm font-semibold text-slate-900">{selectedterminal.id}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">App version</p>
            <p className="truncate text-sm font-semibold text-slate-900">{selectedterminal.app_version}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Site</p>
            <p className="truncate text-sm font-semibold text-slate-900">{selectedterminal.site}</p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Last call home</p>
            <p className="truncate text-sm font-semibold text-slate-900">{selectedterminal.last_call_home}</p>
          </div>
        </div>

        {/* Warning (only when blocking) */}
        {!isBlocked && (
          <ul className="mt-3 list-disc space-y-0.5 rounded-lg border border-red-200 bg-red-50 py-2 pl-7 pr-3 text-xs text-red-700">
            <li>Call-home requests from this device will be rejected.</li>
            <li>Its call-home history is kept for your records.</li>
            <li>You can reverse this at any time with Unblock.</li>
          </ul>
        )}

        {/* Reason */}
        <div className="mt-4 flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-slate-900">Reason</p>
          <Customreasondrop />
        </div>

        {/* Confirm */}
        <div className="mt-4 flex flex-col gap-1.5">
          {iderrormessage && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
              {iderrormessage}
            </p>
          )}
          <p className="break-words text-sm font-semibold text-slate-900">
            Type {selectedterminal.id} to confirm
          </p>
          <input
            type="text"
            value={confirmId}
            className="h-10 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            placeholder={selectedterminal.id}
            onChange={(e) => setconfirmId(e.target.value)}
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className="h-10 w-full cursor-pointer select-none rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            className={`h-10 w-full cursor-pointer select-none rounded-lg px-5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${actionBtn}`}
            onClick={() => updateBlocked(!isBlocked)}
          >
            {submitting ? "Saving..." : isBlocked ? "Unblock" : "Block device"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blocking;