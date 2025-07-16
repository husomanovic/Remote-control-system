import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const uploadDir = path.join(process.cwd(), 'public/user');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024,
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Upload error' });
        }

        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileName = path.basename(file.filepath);
        return res.status(200).json({ path: `/user/${fileName}` });
    });
}