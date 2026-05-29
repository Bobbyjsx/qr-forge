import { WorkspaceSidebar } from '@/components/layout/workspace-sidebar';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <WorkspaceSidebar />
      <main className="flex-1 min-w-0 h-full relative">
        {children}
      </main>
    </div>
  );
}
