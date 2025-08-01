"use client";

import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const DeviceScreen = ({ session, token }) => {
    const videoRef = useRef(null);
    const peerConnection = useRef(null);
    const socketRef = useRef(null);
    const [started, setStarted] = useState(false);
    const body = useRef(null);

    let lastMouseSent = 0;
    const throttleDelay = 50;

    const mouseMoveEvent = (e) => {
        const now = Date.now();
        if (now - lastMouseSent < throttleDelay)
            return;
        lastMouseSent = now;
        const rect = e.target.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        if (socketRef.current) {
            socketRef.current.emit("mouse-event", { type: "move", x, y, session });
        }
    }

    const mouseDownEvent = (e) => {
        if (socketRef.current) {
            socketRef.current.emit("mouse-event", { type: "mousedown", button: e.button === 2 ? "right" : e.button === 1 ? "middle" : "left", session });
        }
    };

    const mouseUpEvent = (e) => {
        if (socketRef.current) {
            socketRef.current.emit("mouse-event", { type: "mouseup", button: e.button === 2 ? "right" : e.button === 1 ? "middle" : "left", session });
        }
    };

    const mouseClickEvent = (e) => {
        if (socketRef.current) {
            socketRef.current.emit("mouse-event", { type: "click", button: e.button === 2 ? "right" : e.button === 1 ? "middle" : "left", session });
        }
    };

    const mouseDblClickEvent = (e) => {
        if (socketRef.current) {
            socketRef.current.emit("mouse-event", { type: "click", button: e.button === 2 ? "right" : e.button === 1 ? "middle" : "left", double: true, session });
        }
    };

    let lastScrollSent = 0;
    const scrollThrottleDelay = 80;
    const mouseWheelEvent = (e) => {
        const now = Date.now();
        if (now - lastScrollSent < scrollThrottleDelay) return;
        lastScrollSent = now;
        if (socketRef.current) {
            socketRef.current.emit("mouse-event", { type: "scroll", amount: e.deltaY, session });
        }
    };

    const keydownEvent = (e) => {
        if (socketRef.current) {
            socketRef.current.emit("keyboard-event", { key: e.key, type: "keydown", session });
        }
    };


    useEffect(() => {
        let isMounted = true;
        let localPeerConnection = null;
        let localSocket = null;
        let offerSent = false;

        body.current = document.querySelector('body');
        body.current.addEventListener("keydown", keydownEvent);

        const element = videoRef.current;
        if (element) {
            element.addEventListener("mousemove", mouseMoveEvent);
            element.addEventListener("mousedown", mouseDownEvent);
            element.addEventListener("mouseup", mouseUpEvent);
            element.addEventListener("click", mouseClickEvent);
            element.addEventListener("dblclick", mouseDblClickEvent);
            element.addEventListener("wheel", mouseWheelEvent);

        }
        const cleanup = () => {
            if (localPeerConnection) {
                localPeerConnection.ontrack = null;
                localPeerConnection.onicecandidate = null;
                localPeerConnection.close();
                localPeerConnection = null;
            }
            if (localSocket) {
                localSocket.disconnect();
                localSocket = null;
            }
            offerSent = false;
        };

        cleanup();

        localSocket = io(process.env.NEXT_PUBLIC_API_URL, {
            auth: { token },
        });
        socketRef.current = localSocket;

        const startWebRTC = async () => {
            if (offerSent) return;
            offerSent = true;
            localPeerConnection = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            });
            peerConnection.current = localPeerConnection;

            localPeerConnection.ontrack = (event) => {
                console.log(event);
                if (videoRef.current) {
                    videoRef.current.srcObject = event.streams[0];
                    videoRef.current.play()
                }
            };

            await localPeerConnection.addTransceiver("video", { direction: "recvonly" });
            if (!isMounted || !localPeerConnection) return;

            const offer = await localPeerConnection.createOffer();
            if (!isMounted || !localPeerConnection) return;

            await localPeerConnection.setLocalDescription(offer);
            if (!isMounted || !localPeerConnection) return;

            localSocket.emit("webrtc-offer", { offer, session });

            localSocket.on("webrtc-answer", async ({ answer }) => {
                if (!localPeerConnection || !isMounted)
                    return;
                if (!localPeerConnection.currentRemoteDescription) {
                    await localPeerConnection.setRemoteDescription(new window.RTCSessionDescription(answer));
                }
            });

            localSocket.on("webrtc-ice", async ({ candidate }) => {
                if (!localPeerConnection || !isMounted) return;
                if (candidate) {
                    try {
                        await localPeerConnection.addIceCandidate(candidate);
                    } catch (err) {
                        console.error("Greška kod ICE kandidata:", err);
                    }
                }
            });

            localPeerConnection.onicecandidate = (event) => {
                if (!localPeerConnection || !isMounted)
                    return;
                if (event.candidate) {
                    localSocket.emit("webrtc-ice", { candidate: event.candidate, session });
                }
            };

            localPeerConnection.onconnectionstatechange = () => {
                console.log("Connection state:", localPeerConnection.connectionState);
            };

        };

        startWebRTC();

        return () => {
            body.current.removeEventListener('keydown', keydownEvent);

            element.removeEventListener("mousemove", mouseMoveEvent);
            element.removeEventListener("mousedown", mouseDownEvent);
            element.removeEventListener("mouseup", mouseUpEvent);
            element.removeEventListener("click", mouseClickEvent);
            element.removeEventListener("dblclick", mouseDblClickEvent);
            element.removeEventListener("wheel", mouseWheelEvent);

            isMounted = false;
            cleanup();
        };
    }, [session, token]);


    return (
        <div className="w-full h-full bg-black flex justify-center items-center relative"        >
            <h2
                hidden={started}
                className="absolute text-white text-2xl font-bold  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                Connecting...
            </h2>

            <video
                onPlay={() => setStarted(true)}
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-w-full max-h-full rounded shadow-lg "
            />
        </div>
    );
};

export default DeviceScreen;
