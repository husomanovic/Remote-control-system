import React, { useEffect, useRef } from 'react'
import Link from 'next/link';

const Main = () => {

    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, []);

    const handleVideoEnded = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }
    };

    return (
        <main className="main-content select-none ">
            <div className="w-full h-full flex items-center pt-7xl">
                <div className="w-full grid lg:grid-cols-2 gap-8 items-center  lg:px-8">

                    {/* Left Side - Text Content */}
                    <div className="space-y-8 text-white">
                        <div className="space-y-6">
                            <h2 className="text-5xl lg:text-6xl font-bold">
                                <span className="gradient-text">Remote Control</span>
                                <br />
                                <span className="text-white">System</span>
                            </h2>
                            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                                A web platform for accessing and controlling computers, allowing users to view the screen of a remote computer and interactively control it via mouse and keyboard directly from a web browser.                                </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/login" className="hero-button text-white px-8 py-4 rounded-full font-semibold text-center">
                                Login
                            </Link>
                            <Link href="/register" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-center hover:bg-white hover:text-black transition-all duration-300">
                                Register
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Video */}
                    <div className="video-container flex h-[500px] lg:h-[600px] ">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            loop
                            onEnded={handleVideoEnded}
                            className="w-full h-full object-cover"
                        >
                            <source src="/digital_earth2.mp4" type="video/mp4" />
                        </video>
                        <div className=" h-full z-20 ap w-[30px] absolute  left-0 bg-linear-to-r from-black  to-transparent"></div>
                        <div className=" h-full z-20 ap w-[30px] absolute  right-0 bg-linear-to-l from-black  to-transparent"></div>


                    </div>

                </div>

            </div>
        </main>

    )
}

export default Main