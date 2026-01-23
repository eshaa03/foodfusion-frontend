
import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { getSystemSettings, updateSystemSettings } from "../../../api/api"; // ✅ IMPORT

function SystemSettings() {
    const [settings, setSettings] = useState({
        deliveryFee: 40,
        taxRate: 5,
        minOrderValue: 100,
        siteMaintenance: false,
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true); // ✅ Loading state for initial fetch
    const [saved, setSaved] = useState(false);

    // ✅ FETCH SETTINGS ON MOUNT
    useEffect(() => {
        getSystemSettings()
            .then((res) => {
                setSettings(res.data);
            })
            .catch((err) => console.error("Failed to load settings:", err))
            .finally(() => setFetching(false));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === "checkbox" ? checked : value,
        });
        setSaved(false);
    };

    const handleSave = () => {
        setLoading(true);
        updateSystemSettings(settings)
            .then(() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            })
            .catch((err) => alert("Failed to save settings"))
            .finally(() => setLoading(false));
    };

    if (fetching) return <div className="p-10 text-center">Loading settings...</div>;

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h2 className="text-[24px] font-[800] text-gray-800 mb-2">System Settings</h2>
                <p className="text-gray-600 text-[14px]">Manage global application configurations</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
                {/* General Settings */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">General Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Base Delivery Fee (₹)</label>
                            <input
                                type="number"
                                name="deliveryFee"
                                value={settings.deliveryFee}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#E23744]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate (%)</label>
                            <input
                                type="number"
                                name="taxRate"
                                value={settings.taxRate}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#E23744]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Order Value (₹)</label>
                            <input
                                type="number"
                                name="minOrderValue"
                                value={settings.minOrderValue}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#E23744]"
                            />
                        </div>
                    </div>
                </div>

                {/* System Control */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">System Control</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-gray-800">Maintenance Mode</h4>
                            <p className="text-sm text-gray-500">Enable to prevent new orders and show maintenance page</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="siteMaintenance"
                                checked={settings.siteMaintenance}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E23744]"></div>
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end pt-4">
                    {saved && <span className="text-green-600 font-medium mr-4">Settings saved successfully!</span>}
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-[#E23744] text-white rounded-xl hover:bg-[#c42e3a] transition-all disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SystemSettings;
