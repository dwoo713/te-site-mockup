import Portal from '../components/Portal';
import data from './data.json';

export const metadata = {
  title: 'Employee Portal — Tumlinson Electric',
  description: 'HR, onboarding, benefits, company info, and employee resources',
};

export default function EmployeePortalPage() {
  return (
    <Portal
      title="Employee Portal"
      subtitle="HR · Onboarding · Benefits · Company Info"
      data={data as any}
      accentColor="#16635C"
      showPTO={true}
      storageKey="employee-portal"
    />
  );
}
