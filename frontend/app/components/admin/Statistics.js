'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    FiCpu,
    FiHardDrive,
    FiDownload,
    FiUpload,
    FiUsers,
    FiSmartphone,
    FiLink,
    FiServer,
    FiMonitor,
    FiInfo
} from 'react-icons/fi';

const StatCard = ({ title, value, subtitle, icon: Icon, description }) => (
    <div className="feature-card rounded-lg p-6 flex flex-col items-center justify-center min-w-[200px] text-center relative group">
        {Icon && (
            <div className="text-3xl mb-3 text-indigo-400">
                <Icon />
            </div>
        )}
        <div className="text-gray-300 text-sm mb-2">{title}</div>
        <div className="text-2xl font-bold mb-2 gradient-text">{value}</div>
        {subtitle && (
            <div className="text-xs text-gray-400 mb-2">{subtitle}</div>
        )}
        {description && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="relative">
                    <FiInfo className="text-gray-400 text-sm cursor-help" />
                    <div className="absolute right-0 top-6 w-48 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg z-10 border border-gray-700">
                        {description}
                    </div>
                </div>
            </div>
        )}
    </div>
);

const Statistics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [frontendStats, setFrontendStats] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/admin/stats', {
                withCredentials: true,
            });
            setStats(res.data);
            setLastUpdate(new Date());
        } catch (e) {
            console.error('Error fetching backend stats:', e);
        }
    };

    const fetchFrontendStats = async () => {
        try {
            const res = await axios.get('/api/frontend-stats');
            setFrontendStats(res.data);
        } catch (e) {
            console.error('Error fetching frontend stats:', e);
        }
    };

    const fetchAllStats = async () => {
        await Promise.all([fetchStats(), fetchFrontendStats()]);
        setLoading(false);
    };

    useEffect(() => {
        fetchAllStats();

        const interval = setInterval(fetchAllStats, 3000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-3">System Statistics</h1>
                    <p className="text-gray-400 text-lg">Real-time monitoring system statistics</p>
                </div>
                {lastUpdate && (
                    <div className="text-right">
                        <div className="text-sm text-gray-400">Last updated:</div>
                        <div className="text-sm text-indigo-400">
                            {lastUpdate.toLocaleTimeString()}
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Server Resources</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="content-section rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <FiServer className="w-6 h-6 mr-2 text-indigo-400" />
                            Backend Server
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard
                                title="CPU Load"
                                value={stats?.server?.cpu?.toFixed(1) + ' %'}
                                icon={FiCpu}
                            />
                            <StatCard
                                title="RAM Usage"
                                value={((stats?.server?.ram?.used / 1024 / 1024 / 1024).toFixed(2)) + ' GB'}
                                subtitle={`Total: ${(stats?.server?.ram?.total / 1024 / 1024 / 1024).toFixed(2)} GB`}
                                icon={FiHardDrive}
                            />
                            <StatCard
                                title="Network RX"
                                value={stats?.server?.network?.rx_bytes ? (stats.server.network.rx_bytes / 1024 / 1024).toFixed(2) + ' MB' : '-'}
                                icon={FiDownload}
                            />
                            <StatCard
                                title="Network TX"
                                value={stats?.server?.network?.tx_bytes ? (stats.server.network.tx_bytes / 1024 / 1024).toFixed(2) + ' MB' : '-'}
                                icon={FiUpload}
                            />
                        </div>
                    </div>

                    <div className="content-section rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <FiMonitor className="w-6 h-6 mr-2 text-indigo-400" />
                            Frontend Server
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard
                                title="CPU Load"
                                value={frontendStats?.cpu?.toFixed(1) + ' %'}
                                icon={FiCpu}
                            />
                            <StatCard
                                title="RAM Usage"
                                value={frontendStats ? (frontendStats.ram.used / 1024 / 1024 / 1024).toFixed(2) + ' GB' : '-'}
                                subtitle={`Total: ${frontendStats ? (frontendStats.ram.total / 1024 / 1024 / 1024).toFixed(2) : '-'} GB`}
                                icon={FiHardDrive}
                            />
                            <StatCard
                                title="Network RX"
                                value={frontendStats?.network?.rx_bytes ? (frontendStats.network.rx_bytes / 1024 / 1024).toFixed(2) + ' MB' : '-'}
                                icon={FiDownload}
                            />
                            <StatCard
                                title="Network TX"
                                value={frontendStats?.network?.tx_bytes ? (frontendStats.network.tx_bytes / 1024 / 1024).toFixed(2) + ' MB' : '-'}
                                icon={FiUpload}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Application Usage</h2>
                <div className="content-section rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Users"
                            value={stats?.users || 0}
                            icon={FiUsers}
                            description="Total number of registered users in the system"
                        />
                        <StatCard
                            title="Devices"
                            value={`${stats?.devices?.online || 0} / ${stats?.devices?.offline || 0}`}
                            subtitle={`Total: ${stats?.devices?.total || 0}`}
                            icon={FiSmartphone}
                            description="Format: Online / Offline devices. Online devices are currently connected and active, offline devices are registered but not currently connected."
                        />
                        <StatCard
                            title="Sessions"
                            value={`${stats?.sessions?.active || 0} / ${stats?.sessions?.expired || 0} / ${stats?.sessions?.terminated || 0}`}
                            subtitle={`Total: ${stats?.sessions?.total || 0}`}
                            icon={FiLink}
                            description="Format: Active / Expired / Terminated sessions. Active sessions are currently in use, expired sessions have passed their time limit, terminated sessions were manually stopped."
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Statistics; 