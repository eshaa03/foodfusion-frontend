// import { useState } from 'react';
// import { Plus, Edit, Trash2, Shield, User, Lock } from 'lucide-react';
// import { motion, AnimatePresence } from 'motion/react';

// const MOCK_ADMINS = [
//   {
//     id: '1',
//     name: 'John Admin',
//     email: 'admin@foodfusion.com',
//     role: 'admin',
//     status: 'active',
//     lastLogin: '2 hours ago',
//     createdAt: 'Jan 15, 2024',
//   },
//   {
//     id: '2',
//     name: 'Sarah Super',
//     email: 'superadmin@foodfusion.com',
//     role: 'superadmin',
//     status: 'active',
//     lastLogin: '5 mins ago',
//     createdAt: 'Jan 10, 2024',
//   },
//   {
//     id: '3',
//     name: 'Mike Manager',
//     email: 'mike@foodfusion.com',
//     role: 'admin',
//     status: 'inactive',
//     lastLogin: '3 days ago',
//     createdAt: 'Feb 1, 2024',
//   },
// ];

// export function AdminManagement() {
//   const [admins, setAdmins] = useState(MOCK_ADMINS);
//   const [showAddModal, setShowAddModal] = useState(false);

//   const toggleStatus = (id) => {
//     setAdmins(
//       admins.map((admin) =>
//         admin.id === id
//           ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
//           : admin
//       )
//     );
//   };

//   const deleteAdmin = (id) => {
//     if (confirm('Are you sure you want to remove this admin?')) {
//       setAdmins(admins.filter((admin) => admin.id !== id));
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-[24px] font-[800] text-gray-800 mb-2">Admin Management</h2>
//           <p className="text-gray-600 text-[14px]">Manage system administrators</p>
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="flex items-center gap-2 px-4 py-2 bg-[#E23744] text-white rounded-lg hover:bg-[#c42e3a] transition-colors"
//         >
//           <Plus className="w-5 h-5" />
//           Add Admin
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//               <User className="w-6 h-6 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-gray-600 text-[13px]">Total Admins</p>
//               <p className="text-[24px] font-[800] text-gray-800">
//                 {admins.filter(a => a.role === 'admin').length}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//               <Shield className="w-6 h-6 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-gray-600 text-[13px]">Super Admins</p>
//               <p className="text-[24px] font-[800] text-gray-800">
//                 {admins.filter(a => a.role === 'superadmin').length}
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//               <Lock className="w-6 h-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-gray-600 text-[13px]">Active</p>
//               <p className="text-[24px] font-[800] text-gray-800">
//                 {admins.filter(a => a.status === 'active').length}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Admins Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Admin</th>
//                 <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Email</th>
//                 <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Role</th>
//                 <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Status</th>
//                 <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Last Login</th>
//                 <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {admins.map((admin) => (
//                 <tr key={admin.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gradient-to-br from-[#E23744] to-[#FFA500] rounded-full flex items-center justify-center text-white font-[700]">
//                         {admin.name.charAt(0)}
//                       </div>
//                       <div>
//                         <p className="font-[600] text-gray-800">{admin.name}</p>
//                         <p className="text-[12px] text-gray-500">Created {admin.createdAt}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-gray-600">{admin.email}</td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-[600] ${
//                       admin.role === 'superadmin'
//                         ? 'bg-purple-100 text-purple-700'
//                         : 'bg-blue-100 text-blue-700'
//                     }`}>
//                       {admin.role === 'superadmin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
//                       {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <button
//                       onClick={() => toggleStatus(admin.id)}
//                       className={`px-3 py-1 rounded-full text-[12px] font-[600] ${
//                         admin.status === 'active'
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-gray-100 text-gray-700'
//                       }`}
//                     >
//                       {admin.status === 'active' ? 'Active' : 'Inactive'}
//                     </button>
//                   </td>
//                   <td className="px-6 py-4 text-gray-600 text-[14px]">{admin.lastLogin}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//                         <Edit className="w-4 h-4 text-gray-600" />
//                       </button>
//                       <button
//                         onClick={() => deleteAdmin(admin.id)}
//                         className="p-2 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <Trash2 className="w-4 h-4 text-red-600" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add Admin Modal */}
//       <AnimatePresence>
//         {showAddModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
//             onClick={() => setShowAddModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//             >
//               <h3 className="text-[20px] font-[700] mb-4">Add New Admin</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-[14px] font-[600] text-gray-700 mb-2">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#E23744]"
//                     placeholder="Enter full name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[14px] font-[600] text-gray-700 mb-2">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#E23744]"
//                     placeholder="admin@example.com"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[14px] font-[600] text-gray-700 mb-2">
//                     Role
//                   </label>
//                   <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#E23744]">
//                     <option value="admin">Admin</option>
//                     <option value="superadmin">Super Admin</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-[14px] font-[600] text-gray-700 mb-2">
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#E23744]"
//                     placeholder="Enter password"
//                   />
//                 </div>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setShowAddModal(false)}
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => setShowAddModal(false)}
//                     className="flex-1 px-4 py-2 bg-[#E23744] text-white rounded-lg hover:bg-[#c42e3a]"
//                   >
//                     Add Admin
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import { useState } from 'react';
import { Plus, Edit, Trash2, Shield, User, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_ADMINS = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@foodfusion.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2 hours ago',
    createdAt: 'Jan 15, 2024',
  },
  {
    id: '2',
    name: 'Sarah Super',
    email: 'superadmin@foodfusion.com',
    role: 'superadmin',
    status: 'active',
    lastLogin: '5 mins ago',
    createdAt: 'Jan 10, 2024',
  },
  {
    id: '3',
    name: 'Mike Manager',
    email: 'mike@foodfusion.com',
    role: 'admin',
    status: 'inactive',
    lastLogin: '3 days ago',
    createdAt: 'Feb 1, 2024',
  },
];

export function AdminManagement() {
  const [admins, setAdmins] = useState(MOCK_ADMINS);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleStatus = (id) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === id
          ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
          : admin
      )
    );
  };

  const deleteAdmin = (id) => {
    if (confirm('Are you sure you want to remove this admin?')) {
      setAdmins(admins.filter((admin) => admin.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[24px] font-[800] text-gray-800 mb-2">
            Admin Management
          </h2>
          <p className="text-gray-600 text-[14px]">
            Manage system administrators
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E23744] text-white rounded-lg hover:bg-[#c42e3a] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-[13px]">Total Admins</p>
              <p className="text-[24px] font-[800] text-gray-800">
                {admins.filter(a => a.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-[13px]">Super Admins</p>
              <p className="text-[24px] font-[800] text-gray-800">
                {admins.filter(a => a.role === 'superadmin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-[13px]">Active</p>
              <p className="text-[24px] font-[800] text-gray-800">
                {admins.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Admin</th>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Role</th>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Last Login</th>
                <th className="px-6 py-4 text-left text-[12px] font-[700] text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#E23744] to-[#FFA500] rounded-full flex items-center justify-center text-white font-[700]">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-[600] text-gray-800">{admin.name}</p>
                        <p className="text-[12px] text-gray-500">Created {admin.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-[600] ${
                      admin.role === 'superadmin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {admin.role === 'superadmin'
                        ? <Shield className="w-3 h-3" />
                        : <User className="w-3 h-3" />}
                      {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(admin.id)}
                      className={`px-3 py-1 rounded-full text-[12px] font-[600] ${
                        admin.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {admin.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-[14px]">
                    {admin.lastLogin}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => deleteAdmin(admin.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-[20px] font-[700] mb-4">Add New Admin</h3>
              <div className="space-y-4">
                <input className="w-full px-4 py-2 border rounded-lg" placeholder="Full name" />
                <input className="w-full px-4 py-2 border rounded-lg" placeholder="Email" />
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option>Admin</option>
                  <option>Super Admin</option>
                </select>
                <input type="password" className="w-full px-4 py-2 border rounded-lg" placeholder="Password" />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-[#E23744] text-white rounded-lg"
                  >
                    Add Admin
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ✅ THIS FIXES YOUR ERROR */
export default AdminManagement;
