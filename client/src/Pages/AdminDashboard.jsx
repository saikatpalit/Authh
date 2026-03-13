import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const { authAxios } = useContext(AppContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const changeRole = async (id, newRole) => {
    try {
      await authAxios.patch(`/admin/users/${id}/role`, { role: newRole });

      toast.success(`Role updated to ${newRole}`);

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await authAxios.get("/admin/users");
        setUsers(data.users);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const admins = users.filter((u) => u.role === "admin").length;
  const verified = users.filter((u) => u.isEmailVerified).length;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-10">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">
            Admin{" "}
<span className="text-[#39ff14]">
  Dashboard
</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage platform users
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500">Total Users</p>
            <p className="text-xl font-semibold mt-1">{totalUsers}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500">Admins</p>
            <p className="text-xl font-semibold mt-1">{admins}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500">Verified</p>
            <p className="text-xl font-semibold mt-1">{verified}</p>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">

          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-700">
              Users
            </h2>

            <span className="text-xs text-gray-500">
              {users.length} records
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-14 text-sm text-gray-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-14 text-gray-500 text-sm">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="text-xs text-gray-500 border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3">ID</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Role</th>
                    <th className="text-left px-5 py-3">Verified</th>
                    <th className="text-left px-5 py-3">Joined</th>
                  </tr>
                </thead>

                <tbody>

                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >

                      {/* ID */}
                      <td className="px-5 py-2.5 text-xs font-mono text-gray-500">
                        {u.id.slice(0, 6)}...{u.id.slice(-4)}
                      </td>

                      {/* EMAIL */}
                      <td className="px-5 py-2.5 text-gray-700">
                        {u.email}
                      </td>

                      {/* NAME */}
                      <td className="px-5 py-2.5 text-gray-600">
                        {u.name || "—"}
                      </td>

                      {/* ROLE */}
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2">

                          <span
                            className={`w-[60px] text-center text-xs px-2 py-1 rounded-md font-medium ${
                              u.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {u.role}
                          </span>

                          <button
                            onClick={() =>
                              changeRole(u.id, u.role === "admin" ? "user" : "admin")
                            }
                            className="w-[80px] text-center text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 transition"
                          >
                            {u.role === "admin" ? "Demote" : "Promote"}
                          </button>

                        </div>
                      </td>

                      {/* VERIFIED */}
                      <td className="px-5 py-2.5 text-xs">

                        <span
                          className={`px-2 py-1 rounded-md ${
                            u.isEmailVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {u.isEmailVerified ? "Verified" : "Unverified"}
                        </span>

                      </td>

                      {/* DATE */}
                      <td className="px-5 py-2.5 text-xs text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;