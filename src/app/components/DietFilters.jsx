import { Check } from 'lucide-react';

const DIET_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
  { id: 'vegan', label: 'Vegan', icon: '🌱' },
  { id: 'keto', label: 'Keto', icon: '🥑' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾' },
  { id: 'low-calorie', label: 'Low Calorie', icon: '⚡' },
  { id: 'low-sugar', label: 'Low Sugar', icon: '🍬' },
];

export function DietFilters({ selectedFilters, onToggleFilter, isDietMode }) {
  return (
    <div className="bg-white rounded-xl p-4 mb-5">
      <h3 className="text-[14px] font-[600] mb-3 text-gray-800">
        Diet Preferences
      </h3>

      <div className="flex flex-wrap gap-2">
        {DIET_OPTIONS.map(option => (
          <button
            key={option.id}
            onClick={() => onToggleFilter(option.id)}
            className="flex items-center gap-2 px-3 py-2 rounded-full text-[11px] font-[600] transition-all"
            style={{
              backgroundColor: selectedFilters.has(option.id)
                ? isDietMode
                  ? 'rgba(76, 175, 80, 0.1)'
                  : 'rgba(226, 55, 68, 0.1)'
                : '#F5F5F5',
              color: selectedFilters.has(option.id)
                ? isDietMode
                  ? 'var(--food-green)'
                  : 'var(--food-red)'
                : '#666',
            }}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
            {selectedFilters.has(option.id) && (
              <Check className="w-3 h-3" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
