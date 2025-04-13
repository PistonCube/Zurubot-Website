const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

// Mock data - replace with real monitoring data
app.get('/api/status', (req, res) => {
    const now = new Date();
    
    // Generate sample metrics data for charts
    const responseTimes = {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        data: Array.from({length: 24}, () => Math.floor(Math.random() * 50) + 50)
    };
    
    const memoryUsage = {
        labels: Array.from({length: 24}, (_, i) => `${i}:00`),
        data: Array.from({length: 24}, () => Math.floor(Math.random() * 100) + 200)
    };
    
    const statusData = {
        status: 'operational',
        uptime: Math.floor(Math.random() * 86400) + 3600, // 1-24 hours in seconds
        api_response_time: Math.floor(Math.random() * 30) + 20,
        servers: Math.floor(Math.random() * 500) + 1500,
        users: Math.floor(Math.random() * 10000) + 50000,
        components: {
            bot: {
                status: 'operational',
                latency: Math.floor(Math.random() * 30) + 20
            },
            api: {
                status: 'operational',
                latency: Math.floor(Math.random() * 50) + 30
            },
            music: {
                status: 'operational',
                latency: Math.floor(Math.random() * 100) + 50
            },
            database: {
                status: 'operational',
                latency: Math.floor(Math.random() * 20) + 10
            }
        },
        metrics: {
            response_times: responseTimes,
            memory_usage: memoryUsage
        },
        incidents: [
            // Sample incident - replace with real data
            /*
            {
                title: "API Latency Issues",
                description: "Increased response times from external APIs were detected and resolved.",
                status: "resolved",
                timestamp: new Date(now.getTime() - 86400000).toISOString() // 24 hours ago
            }
            */
        ]
    };
    
    res.json(statusData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Status API running on port ${PORT}`);
});