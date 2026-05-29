import { AssetDetail } from '@/components/modules/asset-detail';
import { Suspense } from 'react';
import { LoadingState } from '@/components/ui/loading-state';

export default function AssetPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={<LoadingState title="Syncing Node" description="Establishing high-speed telemetry link..." />}>
        <AssetDetail params={params} />
      </Suspense>
    </main>
  );
}
