import { Sparkles } from "lucide-react";
import { FoodCard } from "./FoodCard";

export function AIRecommendations({
  recommendations,
  isDietMode,
  onAddToCart,
  onCustomize,
  favorites = [],
  onToggleFavorite,
  budget,
  onShowReviews,
}) {

  if (!recommendations || recommendations.length === 0) {
    if (isDietMode) {
      return (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: "var(--food-green)" }} />
            <h2 className="text-[18px] font-[700] text-gray-800">AI Recommendations</h2>
          </div>
          <div className="bg-white rounded-xl p-6 text-center text-gray-500 text-sm">
            <p>No truly healthy options found matching your criteria. 🌱</p>
            <p className="text-xs mt-1">Try adjusting your filters or search.</p>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles
          className="w-5 h-5"
          style={{
            color: isDietMode ? "var(--food-green)" : "var(--food-red)",
          }}
        />
        <h2 className="text-[18px] font-[700] text-gray-800">
          AI Recommendations for You
        </h2>
      </div>

      <div className="bg-white rounded-xl p-4 mb-3">
        <p className="text-[12px] text-gray-600 mb-2">
          Based on your {isDietMode ? "healthy eating" : "taste"} preferences and ₹
          {budget.toFixed(2)} budget
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {recommendations.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            isDietMode={isDietMode}
            onAddToCart={onAddToCart}
            onCustomize={onCustomize}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={onToggleFavorite}
            onShowReviews={onShowReviews}
          />
        ))}
      </div>
    </div>
  );
}
