const Toast = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">Success</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
