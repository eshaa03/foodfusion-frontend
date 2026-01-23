import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Bell, Menu, Power, LogOut, ChevronDown } from "lucide-react";
import { Switch } from "@/app/components/ui/switch";

export default function AgentHeader({
  agent,
  isOnline,
  notifications,
  onToggleOnline,
  onNotifications,
  onLogout,
}) {
  const [open, setOpen] = useState(false);

  const agentName = agent?.name || "Delivery Agent";

  const initials = agentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="size-5" />
            </Button>

            {/* PROFILE */}
            <div
              className="relative cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback className="bg-orange-500 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden sm:block">
                  <h2 className="font-semibold text-sm">{agentName}</h2>
                  <span className="text-xs text-gray-600">
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>

                <ChevronDown className="size-4 text-gray-500" />
              </div>

              {/* DROPDOWN */}
              {open && (
                <div className="absolute mt-2 w-40 bg-white border rounded-lg shadow-md right-0 z-50">
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <Power
              className={`size-4 ${
                isOnline ? "text-green-600" : "text-gray-400"
              }`}
            />
            <Switch checked={isOnline} onCheckedChange={onToggleOnline} />

            <Button variant="ghost" size="sm" onClick={onNotifications}>
              <Bell className="size-5" />
              {notifications > 0 && (
                <Badge className="ml-1">{notifications}</Badge>
              )}
            </Button>
          </div>

        </div>
      </div>
    </header>
  );
}
