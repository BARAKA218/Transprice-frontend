import { createRoot } from 'react-dom/client';
import DriverDashboard from './pages/driver/DashboardPage.jsx';
import DriverTrips from './pages/driver/TripsPage.jsx';
import DriverFares from './pages/driver/FaresPage.jsx';
import DriverRoutes from './pages/driver/RoutesPage.jsx';
import DriverVehicle from './pages/driver/VehiclePage.jsx';
import DriverEarnings from './pages/driver/EarningsPage.jsx';
import DriverComplaints from './pages/driver/ComplaintsPage.jsx';
import DriverProfile from './pages/driver/ProfilePage.jsx';
import CoopDashboard from './pages/cooperative/DashboardPage.jsx';
import CoopMembers from './pages/cooperative/MembersPage.jsx';
import CoopDrivers from './pages/cooperative/DriversPage.jsx';
import CoopVehicles from './pages/cooperative/VehiclesPage.jsx';
import CoopRoutes from './pages/cooperative/RoutesPage.jsx';
import CoopTariffs from './pages/cooperative/TariffsPage.jsx';
import CoopProposals from './pages/cooperative/ProposalsPage.jsx';
import CoopComplaints from './pages/cooperative/ComplaintsPage.jsx';
import CoopReports from './pages/cooperative/ReportsPage.jsx';
import AuthDashboard from './pages/authority/DashboardPage.jsx';
import AuthDistricts from './pages/authority/DistrictsPage.jsx';
import AuthRoutes from './pages/authority/RoutesPage.jsx';
import AuthFares from './pages/authority/FaresPage.jsx';
import AuthApprovals from './pages/authority/ApprovalsPage.jsx';
import AuthComplaints from './pages/authority/ComplaintsPage.jsx';
import AuthCooperatives from './pages/authority/CooperativesPage.jsx';
import AuthAnalytics from './pages/authority/AnalyticsPage.jsx';
import AuthReports from './pages/authority/ReportsPage.jsx';
import AuthAuditLogs from './pages/authority/AuditLogsPage.jsx';
import * as api from './services/api.js';
import * as data from './data/mockData.js';

const Pages = [
  DriverDashboard, DriverTrips, DriverFares, DriverRoutes, DriverVehicle,
  DriverEarnings, DriverComplaints, DriverProfile,
  CoopDashboard, CoopMembers, CoopDrivers, CoopVehicles, CoopRoutes,
  CoopTariffs, CoopProposals, CoopComplaints, CoopReports,
  AuthDashboard, AuthDistricts, AuthRoutes, AuthFares, AuthApprovals,
  AuthComplaints, AuthCooperatives, AuthAnalytics, AuthReports, AuthAuditLogs,
];

function Check() {
  return (
    <div>
      <h1>Check: {Pages.length} pages loaded</h1>
      <pre>{JSON.stringify({ apiKeys: Object.keys(api), mockKeys: Object.keys(data) })}</pre>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Check />);
