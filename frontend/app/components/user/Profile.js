import React, { useState, useRef } from 'react';
import { FaEdit } from 'react-icons/fa';

import Image from 'next/image';
import axios from 'axios';


const PROGRAM_FEATURES = {
    Basic: [
        '1 active session',
        '1 user',
        'Email support',
        'Basic analytics',
    ],
    Pro: [
        '5 active sessions',
        'Up to 3 users',
        'Priority email support',
        'Advanced analytics',
        'Device management',
    ],
    Ultra: [
        'Unlimited active sessions',
        'Unlimited users',
        '24/7 premium support',
        'Full analytics & reports',
        'Device management',
        'Custom integrations',
    ],
};

const Profile = ({ username = "Username", email = "user@email.com", image = "" }) => {
    const [selectedProgram, setSelectedProgram] = useState('Basic');
    const [saved, setSaved] = useState(false);
    const [showEditName, setShowEditName] = useState(false);
    const [newName, setNewName] = useState(username);
    const [nameLoading, setNameLoading] = useState(false);
    const fileInputRef = useRef();


    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    const changePhoto = async (e) => {
        const file = e.target.files[0];
        if (!file)
            return;

        const formData = new FormData();
        formData.append('file', file);

        axios.post(process.env.NEXT_PUBLIC_FRONTEND_API_URL + '/updatePhoto', formData)
            .then((res) => {
                if (res.status === 200) {
                    const { path } = res.data;
                    axios.post(process.env.NEXT_PUBLIC_API_URL + '/user/updatePhoto', { path }, { withCredentials: true })
                        .then((res) => {
                            if (res.status === 200) {
                                window.location.reload();
                            }
                        })
                        .catch((err) => {
                            alert(err.response.data.message);
                        })
                }
            })
            .catch((err) => {
                alert(err.response.data.message);
            })

    }

    const handleEditName = async (e) => {
        e.preventDefault();
        setNameLoading(true);

        axios.post(process.env.NEXT_PUBLIC_API_URL + '/user/changeName', { name: newName }, { withCredentials: true })
            .then((res) => {
                if (res.status === 200) {
                    window.location.reload();
                }
            })
            .catch((err) => {
                alert(err.response.data.message);
            })

    };


    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center py-12">
            <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8 flex flex-col items-center">
                <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-lg border-4 border-gray-800 overflow-hidden hover:shadow-blue-400 transition-all duration-400 cursor-pointer"
                        onClick={() => fileInputRef.current.click()}>
                        {image ? (
                            <Image src={image} alt="Profile" className="w-full h-full object-cover "
                                width={200} height={200} />
                        ) : (
                            <span className="text-5xl font-bold text-white select-none">
                                {username[0]}
                            </span>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={changePhoto}
                    />

                </div>
                <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold gradient-text mb-1">{username}</h2>
                    <FaEdit
                        className="text-gray-500 cursor-pointer hover:text-blue-600 transition w-6 h-6 ml-3"
                        onClick={() => setShowEditName(true)}
                        title="Uredi korisničko ime"
                    />
                </div>
                <p className="text-gray-400 text-lg mb-8">{email}</p>

                <div className="w-full bg-gray-800 rounded-xl p-6 mb-6 shadow-inner flex flex-col items-center">
                    <h3 className="text-lg font-semibold gradient-text mb-4">Update Program</h3>
                    <div className="flex flex-col md:flex-row gap-4 mb-4 w-full justify-center">
                        {['Basic', 'Pro', 'Ultra'].map((program) => (
                            <button
                                key={program}
                                onClick={() => setSelectedProgram(program)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${selectedProgram === program
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-700 text-white border-indigo-500 scale-105'
                                        : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
                            >
                                {program}
                            </button>
                        ))}
                    </div>


                    <div className="w-full max-w-md bg-gray-900 rounded-lg border border-gray-700 p-6 mb-4 mt-2">
                        <h4 className="text-md font-semibold gradient-text mb-3">What you get with <span className="capitalize">{selectedProgram}</span>:</h4>
                        <ul className="space-y-2">
                            {PROGRAM_FEATURES[selectedProgram].map((feature, idx) => (
                                <li key={idx} className="flex items-center text-gray-200">
                                    <svg className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={handleSave}
                        className="mt-2 px-8 py-3 bg-gradient-to-r  from-indigo-500 to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
                    >
                        Save Program
                    </button>
                    {saved && <div className="mt-3 text-red-500 font-semibold">Program can't be changed!</div>}
                </div>
            </div>




            {showEditName && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold gradient-text">Edit Name</h3>
                            <button
                                onClick={() => setShowEditName(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleEditName} className="space-y-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center shadow-lg border-4 border-gray-800 overflow-hidden mb-4  hover:shadow-blue-400 transition-all duration-400 cursor-pointer"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {image ? (
                                        <Image src={image} alt="Profile" className="w-full h-full object-cover" width={100} height={100} />
                                    ) : (
                                        <span className="text-3xl font-bold text-white select-none">
                                            {username[0]}
                                        </span>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg"
                                    placeholder="Enter new name"
                                    maxLength={32}
                                    required
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={nameLoading}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {nameLoading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditName(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}





        </div>
    );
};

export default Profile;