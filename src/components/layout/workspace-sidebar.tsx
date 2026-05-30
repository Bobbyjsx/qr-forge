'use client';

import React, { useState, useRef } from 'react';
import { 
  Zap, 
  Plus, 
  History, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PortalTooltip } from '@/components/ui/portal-tooltip';
import { Button } from '@/components/ui/button';
import { useGetCurrentIdentity, useSignOut } from '@/api/useAuth/auth';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isExpanded: boolean;
  active?: boolean;
}

function NavItem({ icon: Icon, label, href, isExpanded, active }: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Link href={href} className="relative flex items-center group px-3">
      <div 
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 ${
          active 
            ? 'bg-orange-100 text-brand-orange shadow-sm border border-orange-100/50' 
            : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600'
        } ${!isExpanded ? 'justify-center' : ''}`}
      >
        <div className="shrink-0 flex items-center justify-center">
          <Icon size={22} className={active ? 'fill-brand-orange/10' : ''} />
        </div>
        
        <AnimatePresence mode="popLayout">
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 font-bold text-sm whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <PortalTooltip label={label} targetRef={ref} isVisible={!isExpanded && isHovered} />
    </Link>
  );
}

export function WorkspaceSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const { data: user } = useGetCurrentIdentity();
  const signOutMutation = useSignOut();

  const handleSignOut = async () => {
    signOutMutation.mutate();
  };

  const navItems = [
    { icon: Plus, label: 'Create QR Code', href: '/workspace' },
    { icon: History, label: 'My Library', href: '/assets' },
  ];

  return (
    <>
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-orange text-white rounded-2xl shadow-2xl z-50 flex items-center justify-center active:scale-95 transition-transform"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 280 : 88 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="hidden lg:flex flex-col border-r border-zinc-100 bg-zinc-50/50 h-screen sticky top-0 z-40 overflow-visible"
      >
        <div className={`h-24 flex items-center mb-4 overflow-hidden transition-all duration-300 ${isExpanded ? 'px-6' : 'justify-center px-0'}`}>
          <Link href="/assets" className="flex items-center gap-3 min-w-max">
            <div className="w-10 h-10 bg-brand-orange rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 hover:rotate-6 transition-transform cursor-pointer shrink-0">
              <Zap className="text-white fill-white" size={20} />
            </div>
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-black text-xl tracking-tighter text-zinc-800 whitespace-nowrap"
                >
                  QR Forge
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 overflow-hidden">
          {navItems.map((item) => (
            <NavItem 
              key={item.label} 
              {...item} 
              isExpanded={isExpanded} 
              active={pathname === item.href}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100 space-y-4">
          <div className="px-2 relative">
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  className="fixed bottom-6 left-24 w-64 bg-white border border-zinc-100 shadow-2xl rounded-2xl p-6 z-[100] overflow-hidden"
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 shadow-sm">
                         <User className="text-brand-orange" size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-zinc-800 truncate uppercase tracking-tighter">
                          {user?.email?.split('@')[0] || 'Guest'}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">
                           Account Active
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest px-1">Subscription</p>
                       <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                          <p className="text-xs font-bold text-brand-orange uppercase">{user ? 'Pro Account' : 'Free Account'}</p>
                       </div>
                    </div>

                    <div className="h-px w-full bg-zinc-50" />
                    
                    <Button 
                      variant="danger" 
                      size="md" 
                      className="w-full gap-3 rounded-xl"
                      onClick={handleSignOut}
                    >
                      <LogOut size={16} /> Log Out
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer group bg-white/50 border border-transparent hover:border-zinc-200 ${!isExpanded ? 'justify-center' : ''}`}
            >
              <div className="w-8 h-8 bg-zinc-200 rounded-lg shrink-0 flex items-center justify-center text-zinc-500">
                <User size={16} />
              </div>
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-[11px] font-black text-zinc-800 truncate uppercase tracking-tighter">
                      {user?.email?.split('@')[0] || 'Guest'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center p-3 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-xl transition-all"
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </motion.aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="lg:hidden fixed top-0 left-0 w-[80%] h-full bg-white z-50 p-8 flex flex-col gap-10 shadow-2xl"
            >
               <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-orange rounded-2xl flex items-center justify-center shadow-xl shadow-orange-100">
                  <Zap className="text-white fill-white" size={28} />
                </div>
                <span className="font-black text-2xl tracking-tight text-zinc-800">QR Forge</span>
              </div>

              <nav className="flex-1 space-y-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.label} 
                    href={item.href} 
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-4 p-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
                      pathname === item.href 
                        ? 'bg-orange-50 text-brand-orange' 
                        : 'bg-zinc-50 text-zinc-400'
                    }`}
                  >
                    <item.icon size={24} />
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              <div className="pt-8 border-t border-zinc-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400">
                  <User size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm uppercase tracking-tighter text-zinc-800">{user?.email?.split('@')[0] || 'Guest'}</p>
                  <p className="text-[10px] font-bold text-brand-orange uppercase">{user ? 'Pro Account' : 'Free Account'}</p>
                </div>
                {user && (
                   <button onClick={handleSignOut} className="text-zinc-400 hover:text-red-500">
                      <LogOut size={20} />
                   </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
