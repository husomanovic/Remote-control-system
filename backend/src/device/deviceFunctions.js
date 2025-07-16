import db from "../db.js";
import { createSessionToken } from "../token.js";

const verifySession = (req, res) => {
    const { session, deviceId } = req.body;
    db.query("SELECT * FROM sessions WHERE session = $1 ", [session], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }
        else if (result.rows.length === 0) {
            return res.status(404).json({ message: "Session not found" });
        }
        else if (result.rows[0].status !== "active") {
            return res.status(400).json({ message: "Session is " + result.rows[0].status });
        }

        else if (!result.rows[0].device_id) {
            db.query("UPDATE sessions SET device_id = $1 WHERE session = $2 RETURNING *;", [deviceId, session], (err, result2) => {
                if (err) {
                    return res.status(500).json({ message: "Server error" });
                }

                const token = createSessionToken({ user_id: result2.rows[0].user_id, device_id: result2.rows[0].device_id, session: result2.rows[0].session, device: "agent" })
                return res.status(200).json({ message: "Session verified successfully", token });
            })
        }
        else {
            if (result.rows[0].device_id !== deviceId) {
                return res.status(400).json({ message: "Session is in use" });
            }
            const token = createSessionToken({ user_id: result.rows[0].user_id, device_id: result.rows[0].device_id, session: result.rows[0].session, device: "agent" })
            return res.status(200).json({ message: "Session verified successfully", token });
        }
    });

}

const verifyDeveice = (req, res) => {
    const { id, name } = req.body;

    db.query("SELECT * FROM devices WHERE id = $1;", [id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }
        if (result.rows.length === 0) {


            db.query("INSERT INTO devices (id, name) VALUES ($1, $2) RETURNING *;", [id, name], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Server error" });
                }

                return res.status(200).json({ message: "Device create successfully" });
            })
        }

        db.query("UPDATE devices SET name = $1, last_seen = NOW() WHERE id = $2;", [name, id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Server error" });
            }
        })

        return res.status(200).json({ message: "Device verified successfully" });
    });

}

const activateDevice = (deviceId) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE devices SET last_seen = NOW(), status = 'online' WHERE id = $1 and status = 'offline' RETURNING id;",
            [deviceId],
            (err, result) => {
                if (err) {
                    return resolve({ message: "Server error", status: 1 });
                }
                if (result.rows.length === 0) {
                    return resolve({ message: "Device not found or already active", status: 2 });
                }

                return resolve({ message: "Device activated successfully", status: 0 });
            }
        );
    });
};

const deactivateDevice = (deviceId) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE devices SET last_seen = NOW(), status = 'offline' WHERE id = $1 AND status = 'online' RETURNING id;",
            [deviceId],
            (err, result) => {
                if (err) {
                    return resolve({ message: "Server error", status: 1 });
                }
                if (result.rows.length === 0) {
                    return resolve({ message: "Device not found or already offline", status: 2 });
                }

                return resolve({ message: "Device deactivated successfully", status: 0 });
            }
        );
    });
};
const deactivateALLDevice = () => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE devices SET last_seen = NOW(), status = 'offline' WHERE status = 'online' RETURNING id;",
            [],
            (err, result) => {
                if (err) {
                    return resolve({ message: "Server error", status: 1 });
                }
                if (result.rows.length === 0) {
                    return resolve({ message: "Device not found or already offline", status: 2 });
                }

                return resolve({ message: "Device deactivated successfully", status: 0 });
            }
        );
    });
};

export { verifySession, verifyDeveice, activateDevice, deactivateDevice, deactivateALLDevice };