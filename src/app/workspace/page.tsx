import { QRGenerator } from '@/components/modules/qr-generator';
import { Suspense } from 'react';
import { LoadingState } from '@/components/ui/loading-state';

export default function WorkspacePage() {
  return (
    <div className="h-full bg-white overflow-hidden">
      <Suspense fallback={<LoadingState title="Initializing Forge" description="Preparing the high-fidelity design pipeline..." />}>
        <QRGenerator />
      </Suspense>
    </div>
  );
}
