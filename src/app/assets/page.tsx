import { Dashboard } from '@/components/modules/dashboard';
import { Suspense } from 'react';
import { LoadingState } from '@/components/ui/loading-state';

export default function AssetsPage() {
  return (
    <Suspense fallback={<LoadingState title="Accessing Vault" description="Connecting to your asset library..." />}>
      <Dashboard />
    </Suspense>
  );
}
