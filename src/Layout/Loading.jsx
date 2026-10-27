const Loading = ({ text = "Loading devices..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-green-600" />
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
};

export default Loading;