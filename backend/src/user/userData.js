import db from "../db.js";
import { createSessionToken } from "../token.js";

const userData = (req, res) => {

    db.query("SELECT email, username, image FROM users WHERE id = $1;", [req.token.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }


        return res.status(200).json(result.rows[0]);
    });

};

const updatePhoto = (req, res) => {

    const { path } = req.body;
    db.query("UPDATE users SET image = $1 WHERE id = $2;", [path, req.token.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }
        return res.status(200).json({ message: "Image updated successfully" });
    });

}

const changeName = (req, res) => {

    const { name } = req.body;
    db.query("UPDATE users SET username = $1 WHERE id = $2;", [name, req.token.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }
        return res.status(200).json({ message: "Username updated successfully" });
    });


}

const myDevices = (req, res) => {

    db.query(`
        SELECT DISTINCT ON (d.id)
            d.*, s.id AS session_id, s.status AS session_status, s.session, s.expires_at
        FROM devices d
        LEFT JOIN sessions s ON d.id = s.device_id
        WHERE s.user_id = $1
        ORDER BY d.id, 
                CASE 
                    WHEN s.status = 'active' THEN 0
                    WHEN s.status = 'expired' THEN 1
                    ELSE 2
                END,
                s.created_at DESC;
        `,
        [req.token.id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Server error" });
            }

            return res.status(200).json({ devices: result.rows });
        })
}

const verifySession = (req, res) => {
    const { session } = req.params;

    db.query("SELECT * FROM sessions WHERE session = $1 ", [session], (err, result) => {
        if (err)
            return res.status(500).json({ message: "Server error" });

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Session not found" });

        if (result.rows[0].status !== "active")
            return res.status(400).json({ message: "Session is " + result.rows[0].status });

        if (result.rows[0].user_id !== req.token.id)
            return res.status(400).json({ message: "You don't have permission for this session" });

        const token = createSessionToken({ user_id: result.rows[0].user_id, device_id: result.rows[0].device_id, session: result.rows[0].session, device: "" })
        return res.status(200).json({ message: "Session verified successfully", token });
    });


}



export { userData, updatePhoto, changeName, myDevices, verifySession };