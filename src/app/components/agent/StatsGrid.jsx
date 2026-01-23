import { Card } from "@/app/components/ui/card";
import { Clock, MapPin, Star, TrendingUp } from "lucide-react";

export default function StatsGrid({
  activeOrders,
  averageTime,
  totalDistance,
  rating,
}) {
  const stats = [
    {
      label: "Active Orders",
      value: activeOrders.toString(),
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Avg Delivery Time",
      value: averageTime,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`size-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
