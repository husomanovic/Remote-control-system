'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'
import axios from 'axios';
import Sidebar from '../../../components/admin/Sidebar';
import DeviceScreen from '../../../components/user/DeviceScreen';

const Page = () => {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [token, setToken] = useState("");

    const { session } = useParams();

    useEffect(() => {
        const verifyUser = async () => {

            try {
                const promise1 = axios.get(process.env.NEXT_PUBLIC_API_URL + '/user/data', {
                    withCredentials: true,
                });
                const promise2 = axios.get(process.env.NEXT_PUBLIC_API_URL + '/user/verifySession/' + session, {
                    withCredentials: true,
                });


                const [res, res2] = await Promise.all([promise1, promise2]);


                if (res.status !== 200 || res2.status !== 200)
                    window.location.href = '/login';

                setToken(res2.data.token);
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

            <div className=' h-screen overflow-y-auto  w-full bg-gray-800 p-3.5  '>
                <DeviceScreen session={session} token={token} />
            </div>
        </div>
    );
};

export default Page;
