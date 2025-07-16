"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

const Sidebar = ({ username, email, image }) => {
    const [open, setOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleLogout = () => {

        axios.post(process.env.NEXT_PUBLIC_API_URL + '/logout', {}, { withCredentials: true })
            .then((res) => {
                if (res.status === 200) {
                    window.location.href = '/';
                }
            })
            .catch((err) => {
                alert(err.response.data.message);
            })

    };

    return (
        <>
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setOpen(!open)}
                aria-label="Open sidebar"
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <aside
                className={`
                    h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg fixed top-0 left-0 z-40
                    transition-transform duration-300
                    md:translate-x-0
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                    md:static md:flex md:translate-x-0
                `}
                onClick={() => {
                    if (isUserMenuOpen)
                        setIsUserMenuOpen(false);
                }}
            >
                <div className="flex items-center justify-center h-20 border-b border-gray-800 w-64">
                    <span className="text-2xl select-none font-bold tracking-wide gradient-text">User Panel</span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    <Link href="/user" className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors nav-link" onClick={() => setOpen(false)}>
                        Dashboard
                    </Link>

                    <Link href="/user/devices" className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors nav-link" onClick={() => setOpen(false)}>
                        Devices
                    </Link>
                    <Link href="/user/profile" className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors nav-link" onClick={() => setOpen(false)}>
                        Profile
                    </Link>
                    {/* <Link href="/user/settings" className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors nav-link" onClick={() => setOpen(false)}>
                        Settings
                    </Link> */}
                </nav>

                <div className="border-t border-gray-800 p-4 relative">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={toggleUserMenu}
                    >
                        <div
                            className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg font-semibold overflow-hidden"
                        >
                            {(image && image !== "") ? <Image src={image} alt="User" width={100} height={100} /> : username[0]}
                        </div>
                        <div className="ml-3">
                            <div className="font-medium gradient-text">{username}</div>
                            <div className="text-sm text-gray-400">{email}</div>
                        </div>
                    </div>

                    {isUserMenuOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
                            <ul className="py-1">
                                <li>
                                    <Link href="/user/profile" className="block py-2 px-4 rounded hover:bg-gray-800 transition-colors nav-link" onClick={() => setOpen(false)}>
                                        My Profile
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 nav-link"
                                        style={{ color: 'red' }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </aside>

            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setOpen(false)}
                    aria-label="Close sidebar overlay"
                />
            )}
        </>
    );
};

export default Sidebar;