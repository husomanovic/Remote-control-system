import asyncio
import socketio
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack, RTCIceCandidate
from aiortc.contrib.media import MediaBlackhole
import cv2
import numpy as np
import mss
import time
from av import VideoFrame
import pyautogui

class ScreenVideoStreamTrack(VideoStreamTrack):
    def __init__(self, monitor=0, fps=60):
        super().__init__()
        self.sct = mss.mss()
        self.monitor = self.sct.monitors[monitor]
        self.fps = fps
        self.frame_time = 1.0 / fps
        self.last_frame = time.time()

    async def recv(self):

        pts, time_base = await self.next_timestamp()
        # Ograniči FPS
        now = time.time()
        wait = self.frame_time - (now - self.last_frame)
        if wait > 0:
            await asyncio.sleep(wait)
            
        self.last_frame = time.time()
        img = np.array(self.sct.grab(self.monitor))
        frame = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

        video_frame = VideoFrame.from_ndarray(frame, format="bgr24")
        video_frame.pts = pts
        video_frame.time_base = time_base

        return video_frame

def start_connection(token, session, API_URL  ):
    sio = socketio.AsyncClient()
    pc = None
    video_track = None

    async def create_new_peerconnection():
        nonlocal pc, video_track
        if pc:
            await pc.close()
            pc = None
        pc = RTCPeerConnection()
        video_track = ScreenVideoStreamTrack()
        pc.addTrack(video_track)

        @pc.on("icecandidate")
        async def on_icecandidate(event):
            print("ICE candidate:", event.candidate)
            if event.candidate:
                await sio.emit("webrtc-ice", {"candidate": {
                    "candidate": event.candidate.candidate,
                    "sdpMid": event.candidate.sdpMid,
                    "sdpMLineIndex": event.candidate.sdpMLineIndex
                }, "session": session})
        
        @pc.on("connectionstatechange")
        async def on_connectionstatechange():
            print("Agent connection state:", pc.connectionState)

    @sio.event
    async def connect():
        print("[+] [WebRTC Agent] Socket connected!")

    @sio.on("webrtc-offer")
    async def on_offer(data):
        offer = data["offer"]
        print("[+] [WebRTC Agent] Received offer")
        await create_new_peerconnection()
        await pc.setRemoteDescription(RTCSessionDescription(sdp=offer["sdp"], type=offer["type"]))
        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        await sio.emit("webrtc-answer", {"answer": {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}, "session": session})


    @sio.event
    async def connect():
        print("[+] [WebRTC Agent] Socket connected!")

    @sio.on("webrtc-ice")
    async def on_ice(data):
        candidate = data.get("candidate")

        ip = candidate['candidate'].split(' ')[4]
        port = candidate['candidate'].split(' ')[5]
        protocol = candidate['candidate'].split(' ')[7]
        priority = candidate['candidate'].split(' ')[3]
        foundation = candidate['candidate'].split(' ')[0]
        component = candidate['candidate'].split(' ')[1]
        type = candidate['candidate'].split(' ')[7]
        rtc_candidate = RTCIceCandidate(
            ip=ip,
            port=port,
            protocol=protocol,
            priority=priority,
            foundation=foundation,
            component=component,
            type=type,
            sdpMid=candidate['sdpMid'],
            sdpMLineIndex=candidate['sdpMLineIndex']
        )

        if candidate and pc:
            if candidate.get("candidate") is not None and candidate.get("sdpMid") is not None and candidate.get("sdpMLineIndex") is not None:
                print("[+] [WebRTC Agent] Received ICE candidate")
                await pc.addIceCandidate( rtc_candidate)
            else:
                print("[!] [WebRTC Agent] Ignored null/invalid ICE candidate")

            
        @sio.on("mouse-event")
        async def mouse_event(data):
            try:
                event_type = data.get("type")
                if event_type == "move":
                    screen_w, screen_h = pyautogui.size()
                    x = int(data.get("x", 0.5) * screen_w)
                    y = int(data.get("y", 0.5) * screen_h)
                    pyautogui.moveTo(x, y)
                elif event_type == "click":
                    button = data.get("button", "left")
                    pyautogui.click(button=button)
                elif event_type == "mousedown":
                    button = data.get("button", "left")
                    pyautogui.mouseDown(button=button)
                elif event_type == "mouseup":
                    button = data.get("button", "left")
                    pyautogui.mouseUp(button=button)
                elif event_type == "scroll":
                    amount = data.get("amount", 0)
                    pyautogui.scroll(amount)
            except Exception as e:
                print(f"[!] Mouse event error: {e}")

        @sio.on("keyboard-event")
        async def keyboard_event(data):
            try:
                event_type = data.get("type")
                key = data.get("key")
                if event_type == "keydown":
                    pyautogui.keyDown(key)
            except Exception as e:
                print(f"[!] Keyboard event error: {e}")

    async def main():
        try:
            await sio.connect(
                API_URL,  
                auth={"token": token},
                transports=["websocket"]
            )
            await sio.wait()
        except Exception as e:
            print(f"[!] Connection is breake")

    asyncio.run(main()) 
