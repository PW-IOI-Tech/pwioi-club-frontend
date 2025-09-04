const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-20 h-20 border-6 border-t-[#12294c] border-r-transparent border-b-[#4d6d9e] border-l-transparent rounded-full animate-spin"></div>

      <p className="text-slate-600 text-sm mt-6 font-medium">
        Authenticating...
      </p>
    </div>
  );
};

export default Loader;
