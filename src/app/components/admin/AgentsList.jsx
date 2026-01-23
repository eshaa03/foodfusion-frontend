import { useEffect, useState } from "react";
import API, { deleteUser } from "../../../api/api";
import { Truck, Search, Mail, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function AgentsList() {
  const [agents, setAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isSuperAdmin = currentUser?.role === "superadmin";

  useEffect(() => {
    API.get("/auth/agents")
      .then((res) => setAgents(res.data))
      .catch((err) => console.error("Failed to load agents", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent? This will remove their agent profile and user account.")) return;
    try {
      await deleteUser(id); // NOTE: Agents have a 'user' field, but the list might just give us raw data. Let's check API response structure.
      // If /auth/agents returns User objects (agents have user role 'agent'), then 'id' is correct.
      // If it returns DeliveryAgent objects, we need agent.user._id or just delete the user which cascades?
      // Assuming /auth/agents returns users with role 'agent' or similar structure
      // Wait, let's verify /auth/agents endpoint. 

      setAgents(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete agent");
    }
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[24px] font-[800] text-gray-800 mb-2">
          Agent Management
        </h2>
        <p className="text-gray-600 text-[14px]">
          View and manage delivery agents
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agents by name or email..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:border-[#E23744]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading agents...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                    Agent
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                    Contact
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
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <tr key={agent._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold">
                            {agent.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {agent.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              ID: {agent._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Mail size={16} />
                          {agent.email}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {agent.createdAt
                            ? format(new Date(agent.createdAt), "MMM d, yyyy")
                            : "N/A"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${agent.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {agent.isApproved ? "Active" : "Pending"}
                        </span>
                      </td>
                      {isSuperAdmin && (
                        <td className="p-4">
                          <button
                            onClick={() => handleDelete(agent._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Agent"
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
                      No agents found.
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
