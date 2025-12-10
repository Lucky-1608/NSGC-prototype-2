'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Settings, Database, Shield } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-black text-white pt-10 pb-20">
            <div className="container mx-auto px-4">

                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">System Administration</h1>
                        <p className="text-gray-400">Manage users, roles, and system settings.</p>
                    </div>
                    <Button variant="destructive">
                        <Shield className="w-4 h-4 mr-2" /> Emergency Lockdown
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
                                <h3 className="text-2xl font-bold">2,450</h3>
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
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">System Version</p>
                                <h3 className="text-2xl font-bold">v1.0.2</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* User Management */}
                <Card className="bg-white/5 border-white/10 mb-8">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>User Role Management</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-white/20">Export Data</Button>
                            <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-400">+ Add User</Button>
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
                                    {[
                                        { name: 'Alex Rivera', email: 'alex.r@nsgc.edu', role: 'President', status: 'Active' },
                                        { name: 'Sarah Chen', email: 'sarah.c@nsgc.edu', role: 'Vice President', status: 'Active' },
                                        { name: 'John Doe', email: 'john.d@student.edu', role: 'Student', status: 'Active' },
                                        { name: 'Jane Smith', email: 'jane.s@student.edu', role: 'Student', status: 'Suspended' },
                                    ].map((user, i) => (
                                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
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
                                                <Button variant="ghost" size="sm" className="text-yellow-500 hover:text-yellow-400">Edit</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
