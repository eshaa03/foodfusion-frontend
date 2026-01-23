import { useEffect, useState } from "react";
import API, { getPendingApprovals, getApprovedUsers, approveUser } from "../../../api/api";
import { CheckCircle, Clock, Shield, Search, User } from "lucide-react";
import { format } from "date-fns";

export default function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pendingRes = await getPendingApprovals();
      const approvedRes = await getApprovedUsers();
      setPendingUsers(pendingRes.data);
      setApprovedUsers(approvedRes.data);
    } catch (err) {
      console.error("Failed to load approvals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveUser(id);

      // Move from pending to approved locally
      const approvedUser = pendingUsers.find(u => u._id === id);
      if (approvedUser) {
        setPendingUsers(prev => prev.filter(u => u._id !== id));
        setApprovedUsers(prev => [{ ...approvedUser, isApproved: true }, ...prev]);
      }

    } catch (err) {
      console.error("Failed to approve user", err);
      alert("Failed to approve");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] text-gray-800 mb-2">Approvals</h2>
        <p className="text-gray-600 text-[14px]">
          Manage registration requests from Admins and Agents
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-lg p-1 mb-6 w-fit border border-gray-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === "pending"
              ? "bg-[#E23744] text-white shadow"
              : "text-gray-600 hover:bg-gray-50"
            }`}
        >
          Pending ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${activeTab === "approved"
              ? "bg-[#E23744] text-white shadow"
              : "text-gray-600 hover:bg-gray-50"
            }`}
        >
          Approved History
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading requests...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">User</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Registered</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(activeTab === "pending" ? pendingUsers : approvedUsers).length > 0 ? (
                  (activeTab === "pending" ? pendingUsers : approvedUsers).map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"
                          }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {u.createdAt ? format(new Date(u.createdAt), "MMM d, yyyy") : "N/A"}
                      </td>
                      <td className="p-4">
                        {activeTab === "pending" ? (
                          <button
                            onClick={() => handleApprove(u._id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                        ) : (
                          <span className="flex items-center gap-2 text-green-600 text-xs font-bold">
                            <CheckCircle size={14} />
                            Approved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      No {activeTab} requests found.
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
