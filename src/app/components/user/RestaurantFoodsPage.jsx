import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { FoodCard } from "../FoodCard";

export default function RestaurantFoodsPage({
  isDietMode,
  onAddToCart,
  onCustomize,
  favorites,
  onToggleFavorite,
  onShowReviews,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/foods/restaurant/${id}`)
      .then(res => res.json())
      .then(data => {
        const normalized = data.map(f => ({
          ...f,
          id: f._id,
          price: f.basePrice,
          image: `${import.meta.env.VITE_API_URL}${f.image}`,
          isAvailable: f.isAvailable !== false,
        }));
        setFoods(normalized);
      });
  }, [id]);

  return (
    <div className="px-4 pb-20 pt-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <h2 className="text-xl font-bold mb-4">Menu</h2>

      <div className="flex flex-wrap -mx-2">
        {foods.map(food => (
          <div key={food.id} className="px-2 mb-4">
            <FoodCard
              item={food}
              isDietMode={isDietMode}
              onAddToCart={onAddToCart}
              onCustomize={onCustomize}
              isFavorite={favorites?.includes(food.id)}
              onToggleFavorite={onToggleFavorite}
              onShowReviews={onShowReviews}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
