import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// const INGREDIENTS = [
//   { id: 'cheese', name: 'Extra Cheese', price: 1.5, icon: '🧀' },
//   { id: 'bacon', name: 'Bacon', price: 2.0, icon: '🥓' },
//   { id: 'avocado', name: 'Avocado', price: 1.8, icon: '🥑' },
//   { id: 'tomato', name: 'Tomato', price: 0.5, icon: '🍅' },
//   { id: 'lettuce', name: 'Lettuce', price: 0.3, icon: '🥬' },
//   { id: 'onion', name: 'Onion', price: 0.3, icon: '🧅' },
// ];

// const PORTION_SIZES = [
//   { id: 'small', label: 'Small', multiplier: 0.8 },
//   { id: 'regular', label: 'Regular', multiplier: 1.0 },
//   { id: 'large', label: 'Large', multiplier: 1.3 },
// ];

export function CustomizationPanel({ item, isDietMode, onClose, onAddToCart, budget, initialValues }) {
  const [selectedIngredients, setSelectedIngredients] = useState(new Set(initialValues?.ingredients || []));
  const [portionSize, setPortionSize] = useState(initialValues?.portionSize || 'regular');
  const [quantity, setQuantity] = useState(initialValues?.quantity || 1);
  const INGREDIENTS = item.ingredients || [];
  const PORTION_SIZES = item.portions || [];

  if (!item) return null;

  const selectedPortion =
    PORTION_SIZES.find(p => p.id === portionSize) || PORTION_SIZES[0] || { multiplier: 1 };


  const ingredientsTotal = Array.from(selectedIngredients).reduce((sum, name) => {
    const ingredient = INGREDIENTS.find(i => i.name === name);
    return sum + (ingredient?.price || 0);
  }, 0);


  const totalPrice = (item.price + ingredientsTotal) * selectedPortion.multiplier * quantity;

  const toggleIngredient = (name) => {
    const newSet = new Set(selectedIngredients);
    newSet.has(name) ? newSet.delete(name) : newSet.add(name);
    setSelectedIngredients(newSet);
  };

  const handleAddToCart = () => {
    onAddToCart(
      item,
      { ingredients: Array.from(selectedIngredients), portionSize, quantity },
      totalPrice
    );
    onClose();
  };

  const availableIngredients = isDietMode
    ? INGREDIENTS.filter(i => !['bacon', 'cheese'].includes(i.id))
    : INGREDIENTS;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-[60] flex items-end md:items-center md:justify-center p-4 pb-24 md:pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl w-full md:max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed Header */}
          <div className="bg-white border-b px-6 py-4 flex justify-between items-center shrink-0 z-10">
            <h2 className="text-[20px] font-[700]">Customize {item.name}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-300">
            {/* Item Preview */}
            <div className="flex gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-1">
                <h3 className="text-[16px] font-[600] mb-1">{item.name}</h3>
                <p className="text-[14px] text-gray-600 mb-2">Base Price: ₹{item.price.toFixed(2)}</p>
                {isDietMode && (
                  <p className="text-[12px] text-gray-500">{item.calories} cal • {item.protein}g protein</p>
                )}
              </div>
            </div>

            {/* Portion Size */}
            <div>
              <h3 className="text-[14px] font-[600] mb-3">Portion Size</h3>
              <div className="flex gap-3">
                {PORTION_SIZES.map(size => (
                  <button
                    key={size.id}
                    onClick={() => setPortionSize(size.id)}
                    className="flex-1 py-3 px-4 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: portionSize === size.id ? (isDietMode ? 'var(--food-green)' : 'var(--food-red)') : '#e5e5e5',
                      backgroundColor: portionSize === size.id ? (isDietMode ? 'rgba(76, 175, 80, 0.05)' : 'rgba(239, 68, 68, 0.05)') : 'white',
                    }}
                  >
                    <div className="text-[14px] font-[600]">{size.label}</div>
                    <div className="text-[12px] text-gray-600">{size.multiplier !== 1.0 && `${size.multiplier}x`}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients / Add-ons */}
            <div>
              <h3 className="text-[14px] font-[600] mb-3">Add Ingredients</h3>

              {availableIngredients.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  No add-ons available
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {availableIngredients.map(ingredient => (
                    <button
                      key={ingredient.name}
                      onClick={() => toggleIngredient(ingredient.name)}
                      className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all"
                      style={{
                        borderColor: selectedIngredients.has(ingredient.name)
                          ? isDietMode ? 'var(--food-green)' : 'var(--food-red)'
                          : '#e5e5e5',
                        backgroundColor: selectedIngredients.has(ingredient.name)
                          ? isDietMode ? 'rgba(76, 175, 80, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                          : 'white',
                      }}
                    >
                      <div className="flex-1 text-left">
                        <div className="text-[12px] font-[600]">{ingredient.name}</div>
                        <div className="text-[11px] text-gray-600">
                          +₹{Number(ingredient.price).toFixed(2)}
                        </div>
                      </div>

                      {selectedIngredients.has(ingredient.name) && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[12px]"
                          style={{
                            backgroundColor: isDietMode
                              ? 'var(--food-green)'
                              : 'var(--food-red)'
                          }}
                        >
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
</div>


            {/* Quantity */}
            <div>
              <h3 className="text-[14px] font-[600] mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-[18px] font-[600] min-w-[40px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="border-t p-6 bg-white shrink-0 z-10">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-xl text-white font-[600]"
              style={{ backgroundColor: isDietMode ? 'var(--food-green)' : 'var(--food-red)' }}
            >
              Add to Cart - ₹{totalPrice.toFixed(2)}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
