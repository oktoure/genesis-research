export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center p-10">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="text-slate-500 mt-2">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
