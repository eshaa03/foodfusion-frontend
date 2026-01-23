import { useState, useEffect } from "react";
import { getUsers, deleteUser } from "../../../api/api";
import { User, Search, Mail, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";

function Customers() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const isSuperAdmin = currentUser?.role === "superadmin";

    useEffect(() => {
        getUsers()
            .then((res) => {
                setUsers(res.data.users); // Access 'users' array from response
            })
            .catch((err) => console.error("Failed to load users", err))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete customer");
        }
    };

    const filteredUsers = users.filter((user) =>
        user.role === "user" && (
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-[24px] font-[800] text-gray-800 mb-2">Customers</h2>
                <p className="text-gray-600 text-[14px]">
                    View and manage registered customers
                </p>
            </div>

            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search customers by name or email..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-[#E23744]"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading customers...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-left">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Joined</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                                    {isSuperAdmin && <th className="p-4 text-xs font-bold text-gray-500 uppercase">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{user.name}</p>
                                                        <p className="text-xs text-gray-400">ID: {user._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                    <Mail size={16} />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} />
                                                    {/* Fallback if createdAt is missing */}
                                                    {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === "admin" ? "bg-purple-100 text-purple-700" :
                                                    user.role === "superadmin" ? "bg-red-100 text-red-700" :
                                                        "bg-green-100 text-green-700"
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>

                                            {isSuperAdmin && (
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Customer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500">
                                            No customers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div >
    );
}

export default Customers;
