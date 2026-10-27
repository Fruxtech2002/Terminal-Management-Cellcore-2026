import { useEffect, useRef, useState } from "react";

const REASONS = [
  "Lost or stolen",
  "Suspected compromise",
  "Unrecognized device",
  "Decommissioned or retired",
  "Sending bad or abnormal data",
  "Under investigation",
  "Other",
];

const Customreasondrop = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState("");
  const ref = useRef(null);


  const selected = value !== undefined ? value : internal;

  function handleSelect(reason) {
    if (onChange) onChange(reason);
    else setInternal(reason);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation(); 
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-12 w-full cursor-pointer select-none items-center justify-between rounded-lg border bg-white px-4 text-left text-[15px] transition-colors hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 ${
          open ? "border-slate-400" : "border-slate-300"
        } ${selected ? "text-slate-900" : "text-slate-500"}`}
      >
        <span className="truncate">{selected || "Select a reason"}</span>
        <span
          className={`text-xs text-stone-500 transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-300 bg-white py-1 shadow-lg"
        >
          {REASONS.map((reason) => (
            <div
              key={reason}
              role="option"
              aria-selected={reason === selected}
              onClick={() => handleSelect(reason)}
              className={`cursor-pointer select-none px-4 py-2.5 text-[15px] hover:bg-stone-100 hover:text-slate-900 ${
                reason === selected ? "bg-stone-50 font-semibold text-slate-900" : "text-slate-800"
              }`}
            >
              {reason}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customreasondrop;