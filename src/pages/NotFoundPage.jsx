import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center dark:bg-neutral-950">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-800 text-white">
        <Compass size={30} />
      </div>
      <p className="mt-6 text-6xl font-black text-neutral-200 dark:text-neutral-800">404</p>
      <h1 className="mt-2 text-2xl font-bold text-neutral-900 dark:text-white">This route seems to detour off the map</h1>
      <p className="mt-2 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
        The page you are looking for does not exist or has moved. Let's get you back on the road.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className="rounded-xl bg-navy-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-navy-700"
        >
          Go to homepage
        </Link>
        <Link
          to="/check-fare"
          className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-green-400 dark:border-neutral-700 dark:text-neutral-300"
        >
          Check a fare
        </Link>
      </div>
    </div>
  );
}