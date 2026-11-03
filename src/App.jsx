import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AIAssistant from './components/ai/AIAssistant';

// Public pages
import HomePage from './pages/public/HomePage';
import FareSearchPage from './pages/public/FareSearchPage';
import FaresPage from './pages/public/FaresPage';
import RoutesPage from './pages/public/RoutesPage';
import UpdatesPage from './pages/public/UpdatesPage';
import FuelPricesPage from './pages/public/FuelPricesPage';
import FareHistoryPage from './pages/public/FareHistoryPage';
import ZonesPage from './pages/public/ZonesPage';
import MapsPage from './pages/public/MapsPage';
import OperatorsPage from './pages/public/OperatorsPage';
import HelpPage from './pages/public/HelpPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import TransparencyPage from './pages/public/TransparencyPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Layouts
import PassengerLayout from './pages/layouts/PassengerLayout';
import DriverLayout from './pages/layouts/DriverLayout';
import CooperativeLayout from './pages/layouts/CooperativeLayout';
import AuthorityLayout from './pages/layouts/AuthorityLayout';
import AdminLayout from './pages/layouts/AdminLayout';

// Shared pages
import SharedNotificationsPage from './pages/shared/NotificationsPage';
import SharedSettingsPage from './pages/shared/SettingsPage';

// Passenger pages
import PassengerDashboardPage from './pages/passenger/DashboardPage';
import PassengerCheckFarePage from './pages/passenger/CheckFarePage';
import PassengerRoutesPage from './pages/passenger/RoutesPage';
import PassengerTripsPage from './pages/passenger/TripsPage';
import PassengerSavedRoutesPage from './pages/passenger/SavedRoutesPage';
import PassengerReportsPage from './pages/passenger/ReportsPage';
import PassengerProfilePage from './pages/passenger/ProfilePage';
import PassengerSettingsPage from './pages/passenger/SettingsPage';

// Driver pages
import DriverDashboardPage from './pages/driver/DashboardPage';
import DriverTripsPage from './pages/driver/TripsPage';
import DriverFaresPage from './pages/driver/FaresPage';
import DriverRoutesPage from './pages/driver/RoutesPage';
import DriverVehiclePage from './pages/driver/VehiclePage';
import DriverEarningsPage from './pages/driver/EarningsPage';
import DriverComplaintsPage from './pages/driver/ComplaintsPage';
import DriverProfilePage from './pages/driver/ProfilePage';

// Cooperative pages
import CooperativeDashboardPage from './pages/cooperative/DashboardPage';
import CooperativeMembersPage from './pages/cooperative/MembersPage';
import CooperativeDriversPage from './pages/cooperative/DriversPage';
import CooperativeVehiclesPage from './pages/cooperative/VehiclesPage';
import CooperativeRoutesPage from './pages/cooperative/RoutesPage';
import CooperativeTariffsPage from './pages/cooperative/TariffsPage';
import CooperativeProposalsPage from './pages/cooperative/ProposalsPage';
import CooperativeComplaintsPage from './pages/cooperative/ComplaintsPage';
import CooperativeReportsPage from './pages/cooperative/ReportsPage';

// Authority pages
import AuthorityDashboardPage from './pages/authority/DashboardPage';
import AuthorityDistrictsPage from './pages/authority/DistrictsPage';
import AuthorityRoutesPage from './pages/authority/RoutesPage';
import AuthorityFaresPage from './pages/authority/FaresPage';
import AuthorityApprovalsPage from './pages/authority/ApprovalsPage';
import AuthorityComplaintsPage from './pages/authority/ComplaintsPage';
import AuthorityCooperativesPage from './pages/authority/CooperativesPage';
import AuthorityAnalyticsPage from './pages/authority/AnalyticsPage';
import AuthorityReportsPage from './pages/authority/ReportsPage';
import AuthorityAuditLogsPage from './pages/authority/AuditLogsPage';

// Admin pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminRolesPage from './pages/admin/RolesPage';
import AdminDistrictsPage from './pages/admin/DistrictsPage';
import AdminRoutesPage from './pages/admin/RoutesPage';
import AdminRouteFormPage from './pages/admin/RouteFormPage';
import AdminFaresPage from './pages/admin/FaresPage';
import AdminFareFormPage from './pages/admin/FareFormPage';
import AdminFareImportPage from './pages/admin/FareImportPage';
import AdminFareHistoryPage from './pages/admin/FareHistoryPage';
import AdminSourcesPage from './pages/admin/SourcesPage';
import AdminSourceFormPage from './pages/admin/SourceFormPage';
import AdminResearchPage from './pages/admin/ResearchPage';
import AdminResearchDetailPage from './pages/admin/ResearchDetailPage';
import AdminUpdatesPage from './pages/admin/UpdatesPage';
import AdminUpdateFormPage from './pages/admin/UpdateFormPage';
import AdminFuelPricesPage from './pages/admin/FuelPricesPage';
import AdminFuelPriceFormPage from './pages/admin/FuelPriceFormPage';
import AdminComplaintsPage from './pages/admin/ComplaintsPage';
import AdminAnalyticsPage from './pages/admin/AnalyticsPage';
import AdminAuditLogsPage from './pages/admin/AuditLogsPage';
import AdminSettingsPage from './pages/admin/SettingsPage';

import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/check-fare" element={<FareSearchPage />} />
          <Route path="/fares" element={<FaresPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/fuel-prices" element={<FuelPricesPage />} />
          <Route path="/fare-history" element={<FareHistoryPage />} />
          <Route path="/zones" element={<ZonesPage />} />
          <Route path="/maps" element={<MapsPage />} />
          <Route path="/operators" element={<OperatorsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/transparency" element={<TransparencyPage />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Passenger */}
        <Route path="/passenger" element={<PassengerLayout />}>
          <Route index element={<PassengerDashboardPage />} />
          <Route path="dashboard" element={<Navigate to="/passenger" replace />} />
          <Route path="check-fare" element={<PassengerCheckFarePage />} />
          <Route path="routes" element={<PassengerRoutesPage />} />
          <Route path="trips" element={<PassengerTripsPage />} />
          <Route path="saved-routes" element={<PassengerSavedRoutesPage />} />
          <Route path="reports" element={<PassengerReportsPage />} />
          <Route path="notifications" element={<SharedNotificationsPage />} />
          <Route path="profile" element={<PassengerProfilePage />} />
          <Route path="settings" element={<PassengerSettingsPage />} />
        </Route>

        {/* Driver */}
        <Route path="/driver" element={<DriverLayout />}>
          <Route index element={<DriverDashboardPage />} />
          <Route path="dashboard" element={<Navigate to="/driver" replace />} />
          <Route path="trips" element={<DriverTripsPage />} />
          <Route path="fares" element={<DriverFaresPage />} />
          <Route path="routes" element={<DriverRoutesPage />} />
          <Route path="vehicle" element={<DriverVehiclePage />} />
          <Route path="earnings" element={<DriverEarningsPage />} />
          <Route path="complaints" element={<DriverComplaintsPage />} />
          <Route path="notifications" element={<SharedNotificationsPage />} />
          <Route path="profile" element={<DriverProfilePage />} />
          <Route path="settings" element={<SharedSettingsPage />} />
        </Route>

        {/* Cooperative */}
        <Route path="/cooperative" element={<CooperativeLayout />}>
          <Route index element={<CooperativeDashboardPage />} />
          <Route path="dashboard" element={<Navigate to="/cooperative" replace />} />
          <Route path="members" element={<CooperativeMembersPage />} />
          <Route path="drivers" element={<CooperativeDriversPage />} />
          <Route path="vehicles" element={<CooperativeVehiclesPage />} />
          <Route path="routes" element={<CooperativeRoutesPage />} />
          <Route path="tariffs" element={<CooperativeTariffsPage />} />
          <Route path="proposals" element={<CooperativeProposalsPage />} />
          <Route path="complaints" element={<CooperativeComplaintsPage />} />
          <Route path="reports" element={<CooperativeReportsPage />} />
          <Route path="notifications" element={<SharedNotificationsPage />} />
        </Route>

        {/* Authority */}
        <Route path="/authority" element={<AuthorityLayout />}>
          <Route index element={<AuthorityDashboardPage />} />
          <Route path="dashboard" element={<Navigate to="/authority" replace />} />
          <Route path="districts" element={<AuthorityDistrictsPage />} />
          <Route path="routes" element={<AuthorityRoutesPage />} />
          <Route path="fares" element={<AuthorityFaresPage />} />
          <Route path="approvals" element={<AuthorityApprovalsPage />} />
          <Route path="complaints" element={<AuthorityComplaintsPage />} />
          <Route path="cooperatives" element={<AuthorityCooperativesPage />} />
          <Route path="analytics" element={<AuthorityAnalyticsPage />} />
          <Route path="reports" element={<AuthorityReportsPage />} />
          <Route path="audit-logs" element={<AuthorityAuditLogsPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="roles" element={<AdminRolesPage />} />
          <Route path="districts" element={<AdminDistrictsPage />} />
          <Route path="routes" element={<AdminRoutesPage />} />
          <Route path="routes/new" element={<AdminRouteFormPage />} />
          <Route path="fares" element={<AdminFaresPage />} />
          <Route path="fares/new" element={<AdminFareFormPage />} />
          <Route path="fares/import" element={<AdminFareImportPage />} />
          <Route path="fares/history" element={<AdminFareHistoryPage />} />
          <Route path="sources" element={<AdminSourcesPage />} />
          <Route path="sources/new" element={<AdminSourceFormPage />} />
          <Route path="research" element={<AdminResearchPage />} />
          <Route path="research/:id" element={<AdminResearchDetailPage />} />
          <Route path="updates" element={<AdminUpdatesPage />} />
          <Route path="updates/new" element={<AdminUpdateFormPage />} />
          <Route path="fuel-prices" element={<AdminFuelPricesPage />} />
          <Route path="fuel-prices/new" element={<AdminFuelPriceFormPage />} />
          <Route path="complaints" element={<AdminComplaintsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Redirects */}
        <Route path="/pricing" element={<Navigate to="/check-fare" replace />} />
        <Route path="/profile" element={<Navigate to="/passenger/profile" replace />} />
        <Route path="/settings" element={<Navigate to="/passenger/settings" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <AIAssistant />
    </BrowserRouter>
  );
}