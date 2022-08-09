import { DashboardProvider } from 'src/contexts/dashboard-context';
import DashboardLayout from './DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  );
}
