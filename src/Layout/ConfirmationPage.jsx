import { useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../Context/TerminalProvider";

const ConfirmationPage = ({ newValue, onKeepEditing, onClose }) => {
  const { id } = useParams();
  const { Terminaldata, setTerminaldata } = useAuth();

  const selectedterminal = Terminaldata.find((t) => t.id === id);
  const currentInterval = selectedterminal?.interval_minutes;

  const [saving, setSaving] = useState(false);

  async function handleEdit() {
    if (!Number.isInteger(newValue) || newValue < 1 || newValue > 1440) {
      toast.error("Interval must be a whole number from 1 to 1440");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3002/devices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval_minutes: newValue }),
      });

      if (!res.ok) throw new Error("Update failed");

      setTerminaldata((prev) =>
        prev.map((t) => (t.id === id ? { ...t, interval_minutes: newValue } : t))
      );
      toast.success("Edited successfully");
      onClose(); 
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save your changes. Try again.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <main
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="flex max-h-[92vh] w-[500px] max-w-lg flex-col gap-6 overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 text-stone-900 shadow-xl sm:p-10"
      >
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h1 id="confirm-title" className="text-[28px] font-bold leading-tight">
            Save your changes?
          </h1>
          <p className="text-base leading-normal text-stone-600">
            Review them before they go live.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-stone-200">
          <div className="flex flex-col gap-1.5 px-4 py-3.5">
            <span className="text-[13px] font-medium text-stone-600">Call home interval</span>
            <span className="text-[15px] leading-snug">
              <s className="text-red-800">{currentInterval} min</s>
              <span aria-hidden="true"> → </span>
              <strong>{newValue} min</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-12 px-2 text-base font-medium text-stone-600 underline hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Discard changes
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onKeepEditing}
              disabled={saving}
              className="h-12 rounded-[10px] border-[1.5px] border-stone-900 bg-white px-6 text-base font-medium text-stone-900 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Keep editing
            </button>
            <button
              type="button"
              onClick={handleEdit}
              disabled={saving}
              className="h-12 rounded-[10px] border-[1.5px] border-blue-700 bg-blue-700 px-6 text-base font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmationPage;