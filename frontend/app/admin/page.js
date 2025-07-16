'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from '../components/user/Dashboard';

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/admin/verify', {
                    withCredentials: true,
                });
                if (res.status !== 200) window.location.href = '/login';
            } catch (error) {
                window.location.href = '/login';
            }
        };
        verifyUser();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/user/data', {
                    withCredentials: true,
                });
                setUsername(res.data.username);
                setEmail(res.data.email);
                setImage(res.data.image);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
            </div>
        );
    }

    return (
        <div className='flex overflow-y-auto'>
            <Sidebar username={username} email={email} image={image || ""} />

            <div className=' h-screen overflow-y-auto  w-full  '>
                <Dashboard />
            </div>
        </div>
    );
};

export default Page;
