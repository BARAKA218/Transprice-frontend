import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-[#0f172a]">
      <PublicNavbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
