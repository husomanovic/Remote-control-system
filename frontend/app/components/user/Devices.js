import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Devices = ({ role = "user" }) => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        setLoading(true);
        setError(null);
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/myDevices`, { withCredentials: true })
            .then((res) => {
                if (res.status !== 200) {
                    setError('Failed to load devices');
                }
                setDevices(res.data.devices || []);
            })
            .catch((err) => {
                setError('Failed to load devices');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center w-full h-screen p-6">
            <div className="text-left mb-8 pl-6 w-full">
                <h1 className="text-4xl font-bold gradient-text  mb-3">My Devices</h1>
                <p className="text-gray-400 text-lg">Manage your devices</p>
            </div>

            <div className="w-full max-w-5xl pl-7">
                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading devices...</div>
                ) : error ? (
                    <div className="text-center text-red-400 py-12">{error}</div>
                ) : devices.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">Devices not found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {devices.map((device) => (
                            <div
                                key={device.id}
                                className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col items-center hover:shadow-indigo-700 transition-all duration-200"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center mb-4 shadow-md">
                                    <span className="text-xl font-bold text-white select-none">{device.name ? device.name[0] : '?'}</span>
                                </div>
                                <div className="text-lg font-semibold text-white mb-1 break-all">{device.name || '-'}</div>
                                <div className="text-gray-400 text-sm mb-2 break-all">ID: {device.id}</div>
                                <div className={`text-gray-400 text-sm `}>Session Status: <span className={device.session_status === 'active' ? 'text-green-400' : 'text-red-400'}>{device.session_status}</span> </div>

                                <div
                                    className="flex justify-around mt-2 "
                                    hidden={device.session_status !== 'active'}
                                >
                                    <div className="flex items-center  ml-6 mr-6">
                                        <span
                                            className={`px-3 py-1 text-xs  font-medium rounded-full border ${device.status === 'online' ? 'bg-green-900 text-green-300 border-green-700' : 'bg-gray-700 text-gray-300 border-gray-600'}`}
                                        >
                                            {device.status === 'online' ? 'online' : new Date(device.last_seen).toISOString().slice(0, 16).replace('T', ' ')}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/${role}/devices/${device.session}`}
                                        hidden={!(device.session_status === 'active' && device.status === 'online')}

                                        className={`px-3 py-1 text-xs ml-6 mr-6 w-min h-min font-medium rounded-full border bg-green-900 text-green-300 border-green-700  hover:bg-green-800 hover:text-green-400 hover:border-green-600 transition-all duration-200`}
                                    >
                                        Conect
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-8 p-6 w-full bottom-0  content-section rounded-lg">
                <h3 className="text-lg font-semibold gradient-text mb-4">Device Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                        <p className="mb-2">• <span className="text-white">Connected devices</span> represent machines linked to your account.</p>
                        <p className="mb-2">• You can <span className="text-orange-400">identify</span> devices by name and unique fingerprint.</p>
                    </div>
                    <div>
                        <p className="mb-2">• <span className="text-white">Remove</span> any device you no longer trust or use.</p>
                        <p className="mb-2">• Device status updates in <span className="text-purple-400">real time</span> based on connectivity.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Devices;