'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="header bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex select-none items-center space-x-2">
                        <h1 className="text-2xl font-bold">
                            <span className="gradient-text">Remote Control</span>
                            <span> System</span>
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/#main-content" className="nav-link font-medium ">
                            Home
                        </Link>
                        <Link href="/login" className="nav-link font-medium ">
                            Login
                        </Link>
                        <Link href="/register" className="nav-link font-medium ">
                            Register
                        </Link>
                    </nav>

                    {/* Mobile Toggle Button */}
                    <div className="md:hidden">
                        <button
                            className="text-white focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 space-y-2 flex flex-col items-center">
                        <Link href="/#main-content" className="block font-medium nav-link">
                            Home
                        </Link>
                        <Link href="/login" className="block font-medium nav-link">
                            Login
                        </Link>
                        <Link href="/register" className="block font-medium nav-link">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header
