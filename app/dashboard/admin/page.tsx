'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Settings, Database, Shield, X, Save, Download, AlertTriangle, Trash2, AlertOctagon, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Suspended';
}

export default function AdminDashboard() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [lockdownMode, setLockdownMode] = useState(false);

    // Initial Data
    const [users, setUsers] = useState<User[]>([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Popup States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const [showLockdownModal, setShowLockdownModal] = useState(false);

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Omit<User, 'id'>>({
        name: '',
        email: '',
        role: 'Student',
        status: 'Active'
    });

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role !== 'admin') {
            router.push('/admin/login');
        } else {
            setIsAuthorized(true);
        }

        // Check for persisted lockdown state
        const savedLockdown = localStorage.getItem('lockdownMode');
        if (savedLockdown === 'true') {
            setLockdownMode(true);
        }
    }, [router]);

    // Export Handler
    const handleExportData = () => {
        // Convert users to CSV
        const headers = ['ID', 'Name', 'Email', 'Role', 'Status'];
        const csvContent = [
            headers.join(','),
            ...users.map(u => [u.id, u.name, u.email, u.role, u.status].join(','))
        ].join('\n');

        // Create blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `user_data_export_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Lockdown Handlers
    const initiateLockdownToggle = () => {
        setShowLockdownModal(true);
    };

    const confirmLockdownToggle = () => {
        const newMode = !lockdownMode;
        setLockdownMode(newMode);
        localStorage.setItem('lockdownMode', String(newMode));
        setShowLockdownModal(false);
    };

    // Handlers
    const handleAddUser = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'Student', status: 'Active' });
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            // Edit existing
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
            setSuccessMessage(`User "${formData.name}" updated successfully.`);
        } else {
            // Add new
            const newUser: User = {
                id: Math.random().toString(36).substr(2, 9),
                ...formData
            };
            setUsers(prev => [...prev, newUser]);
            setSuccessMessage(`User "${formData.name}" added successfully.`);
        }
        setIsModalOpen(false);
        setShowSuccessModal(true);

        // Auto-close success modal after 2s
        // setTimeout(() => setShowSuccessModal(false), 2000);
    };

    const initiateDeleteUser = (id: string) => {
        setUserToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = () => {
        if (userToDelete) {
            setUsers(prev => prev.filter(u => u.id !== userToDelete));
            setUserToDelete(null);
            setShowDeleteModal(false);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen text-white pt-24 md:pt-10 pb-20 transition-colors duration-500 ${lockdownMode ? 'bg-red-950/20' : 'bg-black'}`}>
            <div className="container mx-auto px-4">

                <div className="flex justify-between items-center mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold">System Administration</h1>
                            {lockdownMode && (
                                <Badge variant="destructive" className="animate-pulse bg-red-600 border-red-400">
                                    LOCKDOWN ACTIVE
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-400">Manage users, roles, and system settings.</p>
                    </div>
                    <Button
                        variant={lockdownMode ? "outline" : "destructive"}
                        onClick={initiateLockdownToggle}
                        className={lockdownMode ? "border-red-500 text-red-500 hover:bg-red-500/10" : ""}
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        {lockdownMode ? 'Deactivate Lockdown' : 'Emergency Lockdown'}
                    </Button>
                </div>

                {/* System Health */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Users</p>
                                <h3 className="text-2xl font-bold">{users.length}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Database Status</p>
                                <h3 className="text-2xl font-bold text-green-500">Healthy</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">System Version</p>
                                <h3 className="text-2xl font-bold">v1.0.2</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lockdown Warning Banner */}
                {lockdownMode && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-8 flex items-center gap-4 text-red-200"
                    >
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <div>
                            <h3 className="font-bold text-red-500">Security Alert</h3>
                            <p>The system is currently in lockdown mode. Only administrators can access the dashboard. All other user sessions are restricted.</p>
                        </div>
                    </motion.div>
                )}

                {/* User Management */}
                <Card className="bg-white/5 border-white/10 mb-8">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>User Role Management</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 hover:bg-white/10"
                                onClick={handleExportData}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export CSV
                            </Button>
                            <Button size="sm" onClick={handleAddUser} className="bg-cyan-500 text-black hover:bg-cyan-400">+ Add User</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                                        <th className="pb-4">Name</th>
                                        <th className="pb-4">Email</th>
                                        <th className="pb-4">Role</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="py-4 font-medium">{user.name}</td>
                                            <td className="py-4 text-gray-400">{user.email}</td>
                                            <td className="py-4">
                                                <Badge variant="outline" className="border-white/20">{user.role}</Badge>
                                            </td>
                                            <td className="py-4">
                                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {user.status}
                                            </td>
                                            <td className="py-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-cyan-500 hover:text-cyan-400 mr-2"
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-400"
                                                    onClick={() => initiateDeleteUser(user.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit/Add Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-gray-900 border border-white/10 rounded-lg w-full max-w-md shadow-2xl"
                            >
                                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                    <h2 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                                    <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <form onSubmit={handleSave} className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Role</label>
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            >
                                                <option value="Student">Student</option>
                                                <option value="Admin">Admin</option>
                                                <option value="President">President</option>
                                                <option value="Vice President">Vice President</option>
                                                <option value="Faculty">Faculty</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Suspended' })}
                                                className="w-full bg-black/50 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Suspended">Suspended</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex gap-4">
                                        <Button type="button" variant="outline" className="w-full border-white/20" onClick={() => setIsModalOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold">
                                            <Save className="w-4 h-4 mr-2" /> Save User
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Success Confirmation Modal */}
                <AnimatePresence>
                    {showSuccessModal && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-gray-900 border border-green-500 rounded-lg max-w-sm w-full p-6 text-center shadow-2xl"
                            >
                                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
                                <p className="text-gray-400 mb-6">
                                    {successMessage}
                                </p>
                                <Button
                                    className="w-full bg-green-500 text-black hover:bg-green-400 font-bold"
                                    onClick={() => setShowSuccessModal(false)}
                                >
                                    Continue
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {showDeleteModal && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-gray-900 border border-red-500 rounded-lg max-w-sm w-full p-6 text-center shadow-2xl"
                            >
                                <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Delete User?</h3>
                                <p className="text-gray-400 mb-6">
                                    Are you sure you want to delete this user? This action cannot be undone.
                                </p>
                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        className="w-full border-white/10 hover:bg-white/5"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="w-full bg-red-500 text-white hover:bg-red-600 font-bold"
                                        onClick={confirmDeleteUser}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Lockdown Confirmation Modal */}
                <AnimatePresence>
                    {showLockdownModal && (
                        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-red-950 border-2 border-red-500 rounded-lg max-w-md w-full p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.5)]"
                            >
                                <div className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                    <AlertOctagon className="w-10 h-10" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2 tracking-wide uppercase">
                                    {lockdownMode ? 'Deactivate Lockdown?' : 'Emergency Lockdown'}
                                </h3>
                                <p className="text-red-200 mb-8 text-lg leading-relaxed">
                                    {lockdownMode
                                        ? "This will restore normal system access for all users. Are you sure you want to proceed?"
                                        : "WARNING: This will immediately restrict access for all non-admin users. This should only be used in critical emergencies."
                                    }
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        className="w-full bg-red-600 text-white hover:bg-red-700 font-bold py-6 text-lg tracking-wider uppercase"
                                        onClick={confirmLockdownToggle}
                                    >
                                        {lockdownMode ? 'Restore System Access' : 'ACTIVATE LOCKDOWN'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-red-300 hover:text-white hover:bg-red-500/20"
                                        onClick={() => setShowLockdownModal(false)}
                                    >
                                        Cancel Protocol
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
