import express from 'express';
import { verifyAdmin } from './token.js';

import 'dotenv/config';
import db from './db.js';
import si from 'systeminformation';

const admin = express();

admin.use(verifyAdmin);

admin.get('/verify', (req, res) => res.status(200).json({ message: "Success" }));


admin.get('/stats', async (req, res) => {
    try {
        const [cpu, mem, net] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.networkStats()
        ]);

        const statsQuery = `
            SELECT 
                'users' as type, COUNT(*) as count, NULL as status
            FROM users
            UNION ALL
            SELECT 
                'devices' as type, COUNT(*) as count, status
            FROM devices
            GROUP BY status
            UNION ALL
            SELECT 
                'sessions' as type, COUNT(*) as count, status
            FROM sessions
            GROUP BY status
        `;

        const statsResult = await db.query(statsQuery);

        // Obrada rezultata
        let userCount = 0;
        let deviceOnline = 0, deviceOffline = 0;
        let sessionActive = 0, sessionExpired = 0, sessionTerminated = 0;

        statsResult.rows.forEach(row => {
            if (row.type === 'users') {
                userCount = parseInt(row.count, 10);
            } else if (row.type === 'devices') {
                if (row.status === 'online') deviceOnline = parseInt(row.count, 10);
                if (row.status === 'offline') deviceOffline = parseInt(row.count, 10);
            } else if (row.type === 'sessions') {
                if (row.status === 'active') sessionActive = parseInt(row.count, 10);
                if (row.status === 'expired') sessionExpired = parseInt(row.count, 10);
                if (row.status === 'terminated') sessionTerminated = parseInt(row.count, 10);
            }
        });

        const deviceTotal = deviceOnline + deviceOffline;
        const sessionTotal = sessionActive + sessionExpired + sessionTerminated;

        res.json({
            server: {
                cpu: cpu.currentLoad,
                ram: {
                    total: mem.total,
                    used: mem.active,
                    free: mem.available
                },
                network: net[0]
            },
            users: userCount,
            devices: {
                total: deviceTotal,
                online: deviceOnline,
                offline: deviceOffline
            },
            sessions: {
                total: sessionTotal,
                active: sessionActive,
                expired: sessionExpired,
                terminated: sessionTerminated
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


export default admin;