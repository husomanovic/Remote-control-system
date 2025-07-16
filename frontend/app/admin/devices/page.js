'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/admin/Sidebar';
import Devices from '../../components/user/Devices';

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");


    useEffect(() => {
        const verifyUser = async () => {

            try {
                const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/user/data', {
                    withCredentials: true,
                });

                if (res.status !== 200)
                    window.location.href = '/login';

                setLoading(false);
                setEmail(res.data.email);
                setUsername(res.data.username);
                setImage(res.data.image);

            } catch (error) {
                window.location.href = '/login';
            }
        };

        verifyUser();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className='flex overflow-y-auto'>
            <Sidebar username={username} email={email} image={image || ""} />

            <div className=' h-screen overflow-y-auto  w-full  '>
                <Devices role="admin" />
            </div>
        </div>
    );
};

export default Page;
