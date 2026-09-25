'use client';

import React, { useState } from 'react';
import { usePGS } from '@/context/PGSContext';
import { User, UserRole } from '@/types';
import { 
  Users, Plus, Edit2, Trash2, Shield, Search, 
  CheckCircle2, XCircle, Save, X, Mail, Key
} from 'lucide-react';

export default function UsersPage() {
  const { users, screens, addUser, updateUser, deleteUser, currentUser } = usePGS();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingUser, setEditingUser] = useState<Partial<User>>({
    username: '',
    userType: 'Operator',
    allowedScreens: ['all']
  });

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.userType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setModalMode('create');
    setEditingUser({
      username: '',
      userType: 'Operator',
      allowedScreens: ['all']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setModalMode('edit');
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser.username) return;

    if (modalMode === 'create') {
      addUser({
        username: editingUser.username || '',
        userType: (editingUser.userType as UserRole) || 'Operator',
        allowedScreens: editingUser.allowedScreens || ['all']
      });
    } else if (editingUser.id) {
      updateUser(editingUser.id, editingUser);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own active session account.');
      return;
    }
    if (confirm(`Are you sure you want to delete user account "${name}"?`)) {
      deleteUser(id);
    }
  };

  const toggleScreenAssignment = (screenId: string) => {
    const currentList = editingUser.allowedScreens || [];
    if (currentList.includes('all')) {
      setEditingUser({ ...editingUser, allowedScreens: [screenId] });
      return;
    }

    if (currentList.includes(screenId)) {
      const next = currentList.filter(id => id !== screenId);
      setEditingUser({ ...editingUser, allowedScreens: next.length ? next : ['all'] });
    } else {
      setEditingUser({ ...editingUser, allowedScreens: [...currentList, screenId] });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 pb-12">
      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 sm:p-6 shadow-sm space-y-4">
        {/* Centered Title */}
        <div className="text-center">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white tracking-wide">
            User Account Administration
          </h1>
        </div>

        {/* Green Horizontal Accent Line */}
        <div className="w-full h-0.5 bg-[#4caf50] mb-4" />

        {/* Action and Search Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50 text-slate-500" />
            <input
              type="text"
              placeholder="Search username or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            Add User Account
          </button>
        </div>

        {/* Users Table */}
        <div className="border border-slate-300 dark:border-slate-700 rounded overflow-hidden shadow-sm bg-white dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#4a72b8] text-white">
                <tr>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40">USER</th>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40">ROLE / TYPE</th>
                  <th className="py-2.5 px-4 font-semibold border-r border-white/40">FLOOR PERMISSIONS</th>
                  <th className="py-2.5 px-4 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
            <tbody className="divide-y divide-inherit">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                        {user.username.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      user.userType === 'Admin'
                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                        : user.userType === 'Operator'
                        ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30'
                        : 'glass-panel'
                    }`}>
                      <Shield className="h-3 w-3" />
                      {user.userType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {user.allowedScreens?.includes('all') ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">All Floors Unrestricted</span>
                      ) : (
                        user.allowedScreens?.map(scrId => {
                          const scr = screens.find(s => s.id === scrId);
                          return (
                            <span key={scrId} className="px-1.5 py-0.5 rounded text-[10px] font-mono glass-panel border border-inherit">
                              {scr?.name || scrId}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-white/10 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.username)}
                        className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

      {/* Modal: Add or Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-inherit">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                {modalMode === 'create' ? 'Create User Account' : `Edit User: @${editingUser.username}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold opacity-70 uppercase tracking-wider mb-1.5">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.username || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  placeholder="johndoe"
                  className="w-full px-3.5 py-2 text-sm glass-panel border border-inherit rounded-xl focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold opacity-70 uppercase tracking-wider mb-1.5">
                  Account Role
                </label>
                <select
                  value={editingUser.userType || 'Operator'}
                  onChange={(e) => setEditingUser({ ...editingUser, userType: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-sm glass-dropdown border border-inherit focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
                >
                  <option value="Admin">Admin</option>
                  <option value="Operator">Operator</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold opacity-70 uppercase tracking-wider mb-1.5">
                  Assigned Floor Scopes
                </label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser({ ...editingUser, allowedScreens: ['all'] })}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                      editingUser.allowedScreens?.includes('all')
                        ? 'bg-indigo-600/20 border-indigo-500/60 font-bold text-indigo-600 dark:text-indigo-300'
                        : 'glass-panel opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span>All Floors (Full Access)</span>
                    <span className="font-mono text-[10px]">GLOBAL</span>
                  </button>

                  {screens.map(screen => {
                    const isChecked = editingUser.allowedScreens?.includes(screen.id);
                    return (
                      <button
                        key={screen.id}
                        type="button"
                        onClick={() => toggleScreenAssignment(screen.id)}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                          isChecked && !editingUser.allowedScreens?.includes('all')
                            ? 'bg-indigo-600/20 border-indigo-500/60 font-bold text-indigo-600 dark:text-indigo-300'
                            : 'glass-panel opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span>{screen.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-inherit flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm opacity-70 hover:opacity-100 rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
