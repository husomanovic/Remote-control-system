"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

const page = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/;


    const register = () => {

        if (email === "" || password === "" || password2 === "", username === "") {
            alert("Please fill in all fields");
            return;
        }

        if (password !== password2) {
            alert("Passwords do not match");
            return;
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character" });
        }

        axios.post(process.env.NEXT_PUBLIC_API_URL + '/register', { email, password, username })
            .then((res) => {
                if (res.status === 200)
                    window.location.href = "/login";
            }).catch((err) => {
                alert(err.response.data.message);
            })
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Register Form */}
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Back Button */}
                    <Link href="/" className="inline-flex items-center text-white hover:text-gray-300 transition-colors duration-300 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-2">
                            <path d="m12 19-7-7 7-7" />
                            <path d="M19 12H5" />
                        </svg>
                        Back to Home
                    </Link>

                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-white mb-2">Register</h2>
                        <p className="text-gray-300">Create your account for remote control</p>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Username</label>
                            <input
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                name="username"
                                value={username}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Email</label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                name="email"
                                value={email}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">Password</label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                name="password"
                                value={password}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                            <input
                                onChange={(e) => setPassword2(e.target.value)}
                                type="password"
                                name="password2"
                                value={password2}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                placeholder="Confirm your password"
                            />
                        </div>
                        <button
                            type='button'
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                            onClick={register}
                        >
                            Register
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-300">
                            Already have an account?{" "}
                            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page