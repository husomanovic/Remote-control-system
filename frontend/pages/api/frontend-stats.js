import si from 'systeminformation';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [cpu, mem, net] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.networkStats()
    ]);

    res.status(200).json({
      cpu: cpu.currentLoad,
      ram: {
        total: mem.total,
        used: mem.active,
        free: mem.available
      },
      network: net[0] // Prva mrežna kartica
    });
  } catch (error) {
    console.error('Error fetching frontend stats:', error);
    res.status(500).json({ message: 'Error fetching server stats', error: error.message });
  }
} 