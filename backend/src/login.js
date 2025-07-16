import db from "./db.js";
import bcrypt from "bcrypt";
import { sendCookie } from "./token.js";


const login = (req, res) => {

    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email=$1;", [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }

        if (result.rows.length === 0)
            return res.status(400).json({ message: "Invalid email or password" });


        if (!bcrypt.compareSync(password, result.rows[0].password))
            return res.status(400).json({ message: "Invalid email or password" });

        try {
            sendCookie(res, { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role });

            db.query("UPDATE users SET last_login = NOW() WHERE id = $1;", [result.rows[0].id])
                .catch(err => {
                    return res.status(500).json({ message: "Server error" })
                });

            return res.status(200).json({ message: "Success", role: result.rows[0].role });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }

    });



}

const register = (req, res) => {

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/;

    const { email, password, username } = req.body;
    console.log(email, password, username);
    if (!email || !password || !username)
        return res.status(400).json({ message: "Missing email, password or username" });


    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character" });
    }


    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(11111111111111);
            return res.status(500).json({ message: "Error" });
        }

        db.query("INSERT INTO users (email,password,username) VALUES ($1,$2,$3) ON CONFLICT (email) DO NOTHING;", [email, hash, username], (err, result) => {
            if (err) {
                console.error(22222222222222);
                return res.status(500).json({ message: "Error" });
            }

            if (result.rowCount === 0) {
                return res.status(409).json({ message: "User already exists" });
            }

            return res.status(200).json({ message: "Success" });
        });
    });



}

const logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: "Success" });
}


export { login, register, logout };