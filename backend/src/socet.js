import { verifySessionToken } from "./token.js";
import { activateDevice, deactivateDevice } from "./device/deviceFunctions.js";

export function setupSocket(io) {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            const payload = verifySessionToken(token);
            if (!payload) return next(new Error("Unauthorized"));
            socket.session = payload;

            const { device, device_id } = payload;

            if (device === "agent") {
                const { message, status } = await activateDevice(device_id);
                if (status != 0) {
                    return next(new Error(message));
                }
            }

        } catch (error) {
            return next(new Error("Unauthorized: Token verification failed"));
        }

        next();
    });

    io.on("connection", async (socket) => {
        const { session, device, device_id } = socket.session;
        socket.join(session);

        socket.on("webrtc-offer", ({ offer, session }) => {
            socket.to(session).emit("webrtc-offer", { offer });
        });

        socket.on("webrtc-answer", ({ answer, session }) => {
            socket.to(session).emit("webrtc-answer", { answer });
        });

        socket.on("webrtc-ice", ({ candidate, session }) => {
            socket.to(session).emit("webrtc-ice", { candidate });
        });

        socket.on("mouse-event", (data) => {
            socket.to(socket.session.session).emit("mouse-event", data);
        });

        socket.on("keyboard-event", (data) => {
            socket.to(socket.session.session).emit("keyboard-event", data);
        });

        socket.on("disconnect", (reason) => {
            if (device === "agent") {
                deactivateDevice(device_id);
            }
        });
    });
}
