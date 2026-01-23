import { useEffect, useState } from "react";
import API, { deleteUser } from "../../../api/api";
import { Shield, Search, Mail, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner"; // Assuming sonner is installed/used elsewhere, or use alert

export default function AdminsList() {
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Get current user to check if superadmin (for frontend validtation)
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isSuperAdmin = currentUser?.role === "superadmin";

  useEffect(() => {
    API.get("/auth/admins")
      .then((res) => setAdmins(res.data))
      .catch((err) => console.error("Failed to load admins", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await deleteUser(id);
      setAdmins(prev => prev.filter(a => a._id !== id));
      // toast.success("Admin deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete admin");
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // ... (rest of render until table row)


  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] text-gray-800 mb-2">
          Admin Management
        </h2>
        <p className="text-gray-600 text-[14px]">
          View and manage system administrators
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search admins by name or email..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-[#E23744]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading admins...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                    Admin
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                    Status
                  </th>
                  {isSuperAdmin && <th className="p-4 text-xs font-bold text-gray-500 uppercase">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {admin.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              ID: {admin._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Mail size={16} />
                          {admin.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`flex items-center gap-1 w-fit px-2 py-1 rounded text-xs font-bold uppercase ${admin.role === "superadmin"
                            ? "bg-red-100 text-red-700"
                            : "bg-purple-100 text-purple-700"
                            }`}
                        >
                          <Shield size={12} />
                          {admin.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {admin.createdAt
                            ? format(new Date(admin.createdAt), "MMM d, yyyy")
                            : "N/A"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${admin.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {admin.isApproved ? "Active" : "Pending"}
                        </span>
                      </td>
                      {isSuperAdmin && (
                        <td className="p-4">
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Admin"
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
                      No admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
