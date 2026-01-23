import { Card } from "@/app/components/ui/card";
import { IndianRupee, TrendingUp, Package } from "lucide-react";

export default function EarningsCard({
  todayEarnings,
  weekEarnings,
  deliveriesToday,
}) {
  return (
    <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today's Earnings</h3>
        <IndianRupee className="size-6" />
      </div>

      <div className="mb-6">
        <p className="text-4xl font-bold">
          ₹{todayEarnings.toFixed(2)}
        </p>
        <p className="text-orange-100 text-sm mt-1">
          {deliveriesToday} deliveries completed
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-orange-400">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="size-4" />
            <p className="text-sm text-orange-100">This Week</p>
          </div>
          <p className="text-xl font-semibold">
            ₹{weekEarnings.toFixed(2)}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <Package className="size-4" />
            <p className="text-sm text-orange-100">Avg per Order</p>
          </div>
          <p className="text-xl font-semibold">
            ₹
            {deliveriesToday > 0
              ? (todayEarnings / deliveriesToday).toFixed(2)
              : "0.00"}
          </p>
        </div>
      </div>
    </Card>
  );
}
