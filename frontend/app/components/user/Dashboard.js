import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Dashboard = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [copiedSessionId, setCopiedSessionId] = useState(null);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/session/mySession', {
                withCredentials: true
            });
            setSessions(response.data);
            setError(null);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 404) {
                setSessions([]);
                setError(null);
                setLoading(false);
            } else {
                setError('Failed to load sessions');
                setLoading(false);
            }
        }
    };

    const createSession = async (expiresAt) => {
        setCreateLoading(true);
        try {
            await axios.post(process.env.NEXT_PUBLIC_API_URL + '/session/createSession', {
                expires_at: expiresAt
            }, {
                withCredentials: true
            });
            fetchSessions();
            setShowCreateForm(false);
        } catch (err) {
            alert('Failed to create session');
        } finally {
            setCreateLoading(false);
        }
    };

    const terminateSession = async (sessionId) => {
        try {
            console.log(sessionId);
            await axios.put(process.env.NEXT_PUBLIC_API_URL + `/session/terminateSession/${sessionId}`, {}, {
                withCredentials: true
            });
            fetchSessions();
        } catch (err) {
            if (err.response?.status === 404) {
                alert('Session not found');
            } else {
                alert('Failed to terminate session');
            }
        }
    };


    const deleteSession = async (sessionId) => {
        try {
            console.log(sessionId);
            await axios.delete(process.env.NEXT_PUBLIC_API_URL + `/session/deleteSession/${sessionId}`, {
                withCredentials: true
            });
            fetchSessions();
        } catch (err) {
            if (err.response?.status === 404) {
                alert('Session not found');
            } else {
                alert('Failed to delete session');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            active: 'bg-green-900 text-green-300 border-green-700',
            terminated: 'bg-orange-900 text-orange-300 border-orange-700',
            expired: 'bg-purple-900 text-purple-300 border-purple-700'
        };

        return (
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusClasses[status] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                {status}
            </span>
        );
    };

    const handleCreateSession = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const expiresAt = formData.get('expires_at');
        createSession(expiresAt || null);
    };

    // const handleCopy = (session) => {
    //     console.log(session);
    //     navigator.clipboard.writeText(session);
    //     setCopiedSessionId(session);
    //     setTimeout(() => setCopiedSessionId(null), 1500);
    // };


    const handleCopy = async (session, id) => {

        const fallbackCopy = (text) => {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand("copy");
                console.log("✅ Kopirano fallback metodom");
            } catch (err) {
                console.error("❌ Fallback kopiranje nije uspjelo", err);
            }
            document.body.removeChild(textarea);
        };


        try {
            await navigator.clipboard.writeText(session);
        } catch (err) {
            fallbackCopy(session);
        }
        setCopiedSessionId(id);
        setTimeout(() => setCopiedSessionId(null), 1500);
    };



    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
            </div>
        );
    }

    return (
        <>
            <div className="p-6 min-h-screen bg-gray-950">

                <div className="mb-8 flex justify-between items-center">
                    <div >
                        <h1 className="text-4xl font-bold gradient-text mb-3">My Sessions</h1>
                        <p className="text-gray-400 text-lg">Manage your sessions </p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>New Session</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 text-center">
                        <div className="text-red-400 mb-2">{error}</div>
                        <button
                            onClick={fetchSessions}
                            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                <div className="content-section rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Session
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Device
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Expires
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {sessions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium text-white mb-2">No sessions found</h3>
                                                    <p className="text-gray-400 mb-4">You don't have any active sessions yet.</p>
                                                    <button
                                                        onClick={() => setShowCreateForm(true)}
                                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                                                    >
                                                        Create Your First Session
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    sessions.map((session) => (
                                        <tr key={session.id} className="hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">
                                                    {session.session.substring(0, 16)}...
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-300">
                                                    {session.device_name ? ` ${session.device_name}` : '/'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(session.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                {formatDate(session.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                {formatDate(session.expires_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                <button

                                                    onClick={() => handleCopy(session.session, session.id)}
                                                    className="text-indigo-400 hover:text-indigo-300 transition-colors nav-link border border-indigo-700 rounded px-3 py-1"
                                                    style={{ color: '#6366f1' }}
                                                >
                                                    {copiedSessionId === session.id ? 'Copied!' : 'Copy'}
                                                </button>
                                                {session.status != 'active' ?
                                                    <button
                                                        onClick={() => deleteSession(session.id)}
                                                        className="   nav-link  px-3 py-1 ml-2"
                                                        style={{ color: '#f25e30' }}
                                                    >
                                                        Delete

                                                    </button>
                                                    :
                                                    <button
                                                        onClick={() => terminateSession(session.id)}
                                                        className="   nav-link  px-3 py-1 ml-2"
                                                        style={{ color: 'orange' }}
                                                    >
                                                        Terminate
                                                    </button>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 p-6 content-section rounded-lg">
                    <h3 className="text-lg font-semibold gradient-text mb-4">Session Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
                        <div>
                            <p className="mb-2">• <span className="text-white">Active sessions</span> allow you to stay logged in across different devices</p>
                            <p className="mb-2">• <span className="text-orange-400">Terminate</span> any active session to log out from that device</p>
                        </div>
                        <div>
                            <p className="mb-2">• <span className="text-white">Delete</span> any session to permanently remove it</p>
                            <p className="mb-2">• Automatically create sessions  <span className="text-purple-400">expire after 24 hours</span></p>
                        </div>
                    </div>
                </div>
            </div >

            {/* Modal for creating session */}
            {
                showCreateForm && (
                    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900  rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-700">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold gradient-text">Create New Session</h3>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleCreateSession} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Expiration Date (Optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="expires_at"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Leave empty for default 24-hour expiration</p>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={createLoading}
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                    >
                                        {createLoading ? 'Creating...' : 'Create Session'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Dashboard; 