import { UtensilsCrossed } from 'lucide-react';

export function Header({ isDietMode, onToggleMode }) {
  return (
    <header 
      className="px-6 py-5 flex justify-between items-center text-white transition-colors duration-500"
      style={{ backgroundColor: isDietMode ? 'var(--food-green)' : 'var(--food-red)' }}
    >
      <div className="flex items-center gap-2">
        <UtensilsCrossed className="w-8 h-8" />
        <span className="text-[28px] font-[800]">FoodFusion</span>
      </div>
      
      <div 
        className="flex items-center bg-white/20 rounded-full p-1 relative w-[180px] h-[40px] cursor-pointer"
        onClick={onToggleMode}
      >
        <div 
          className="absolute top-1 left-1 w-[86px] h-[32px] bg-white rounded-full transition-transform duration-400"
          style={{ transform: isDietMode ? 'translateX(86px)' : 'translateX(0)' }}
        />
        <div className="flex-1 text-center text-[12px] font-[600] z-10 uppercase">
          Normal
        </div>
        <div className="flex-1 text-center text-[12px] font-[600] z-10 uppercase">
          Healthy
        </div>
      </div>
    </header>
  );
}
