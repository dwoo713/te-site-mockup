import Portal from '../components/Portal';
import data from './data.json';

export const metadata = {
  title: 'Operations Portal — Tumlinson Electric',
  description: 'PM Manual, field operations, software, purchasing, and project management resources',
};

export default function OperationsPortalPage() {
  return (
    <Portal
      title="Operations Portal"
      subtitle="PM Manual · Field Ops · Software · Purchasing · Network Ops"
      data={data as any}
      accentColor="#3b82f6"
    />
  );
}
