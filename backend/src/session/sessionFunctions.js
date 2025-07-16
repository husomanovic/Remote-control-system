import db from "../db.js";

const mySession = (req, res) => {

    db.query(`
        SELECT s.id as id, s.session, s.status, s.created_at ,s.expires_at, d.name as device_name
        FROM sessions s 
        LEFT join devices d on s.device_id=d.id 
        WHERE s.user_id = $1
        ORDER  BY s.status , s.created_at DESC ;
        `, [req.token.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        return res.status(200).json(result.rows);
    });
}

const createSession = (req, res) => {
    const { expires_at } = req.body;
    let query, values;

    if (expires_at) {
        query = "INSERT INTO sessions (user_id, expires_at) VALUES ($1, $2) RETURNING *;";
        values = [req.token.id, expires_at];
    } else {
        query = "INSERT INTO sessions (user_id) VALUES ($1) RETURNING *;";
        values = [req.token.id];
    }

    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        return res.status(200).json(result.rows[0]);
    });



}

const deleteSession = (req, res) => {
    const { sessionId } = req.params;
    console.log(sessionId, req.token.id);

    db.query("DELETE FROM sessions WHERE  id = $1 and user_id = $2;", [sessionId, req.token.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }
        console.log(result);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Session not found" });
        }

        return res.status(200).json({ message: "Session deleted successfully" });
    });
}

const terminateSession = (req, res) => {
    const { sessionId } = req.params;
    db.query("update sessions set status = 'terminated' where  id = $1 and status = 'active' and user_id = $2;", [sessionId, req.token.id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Session not found" });
        }

        return res.status(200).json({ message: "Session terminated successfully" });
    });
}


export { mySession, createSession, deleteSession, terminateSession };