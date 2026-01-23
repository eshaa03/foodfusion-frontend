import { Card } from "@/app/components/ui/card";
import { CheckCircle2, Wifi, Zap } from "lucide-react";

export default function ServiceStatusCard({ isOnline }) {
    return (
        <Card className="p-6 mt-6 bg-white border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>

            <div className="space-y-4">
                {/* Availability */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isOnline ? 'bg-green-100' : 'bg-gray-200'}`}>
                            <Zap className={`size-5 ${isOnline ? 'text-green-600' : 'text-gray-500'}`} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Availability</p>
                            <p className="text-sm text-gray-500">
                                {isOnline ? "You are receiving orders" : "You are currently offline"}
                            </p>
                        </div>
                    </div>
                    <CheckCircle2 className={`size-5 ${isOnline ? 'text-green-500' : 'text-gray-300'}`} />
                </div>

                {/* Network */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100">
                            <Wifi className="size-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Network</p>
                            <p className="text-sm text-gray-500">Connected to fast server</p>
                        </div>
                    </div>
                    <CheckCircle2 className="size-5 text-green-500" />
                </div>
            </div>
        </Card>
    );
}
