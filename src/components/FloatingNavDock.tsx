import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Heart,
  Calendar,
  MessageSquareHeart,
  SlidersHorizontal,
} from 'lucide-react';
import { FloralTheme } from '../types';

interface FloatingNavDockProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenCustomizer?: () => void;
  theme: FloralTheme;
  showEditButton?: boolean;
}

export const FloatingNavDock: React.FC<FloatingNavDockProps> = ({
  activeSection,
  onNavigate,
  onOpenCustomizer,
  theme,
  showEditButton = false,
}) => {
  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'couple', label: 'Couple', icon: Heart },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'wishes', label: 'Wishes', icon: MessageSquareHeart },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] sm:max-w-fit">
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-0.5 sm:gap-1 p-1.5 rounded-full bg-[#1F1B18]/92 backdrop-blur-lg border border-[#DFC186]/60 shadow-2xl text-white overflow-x-auto no-scrollbar"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center p-1.5 sm:px-2.5 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#F3E5AB] font-medium'
                  : 'text-[#D5C7BB] hover:text-white hover:bg-white/10'
              }`}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDockIndicator"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: theme.primaryColor, opacity: 0.7 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
              <span className="hidden lg:inline text-[9px] font-sans-body relative z-10 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Live Customizer Trigger Button (Admin / Edit mode only) */}
        {showEditButton && onOpenCustomizer && (
          <>
            <div className="h-5 w-px bg-white/20 mx-1 shrink-0" />
            <button
              onClick={onOpenCustomizer}
              className="relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-[#DFC186] to-[#C5A059] text-[#2C2420] font-medium text-xs shadow-sm hover:from-[#F3E5AB] hover:to-[#DFC186] transition-all cursor-pointer shrink-0"
              title="Customize Names, Dates, Theme & Music"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-sans-body font-semibold">Edit</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute -top-0.5 -right-0.5" />
            </button>
          </>
        )}
      </motion.nav>
    </div>
  );
};

