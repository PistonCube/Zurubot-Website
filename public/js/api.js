
        // API endpoint for status data
        const STATUS_API_URL = '/api/status';
        
        // Function to format uptime
        function formatUptime(seconds) {
            const days = Math.floor(seconds / (3600 * 24));
            const hours = Math.floor((seconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            
            let uptimeStr = '';
            if (days > 0) uptimeStr += `${days}d `;
            if (hours > 0 || days > 0) uptimeStr += `${hours}h `;
            uptimeStr += `${minutes}m`;
            
            return uptimeStr;
        }
        
        // Function to update status from API
        async function updateStatus() {
            try {
                const response = await fetch(STATUS_API_URL);
                const data = await response.json();
                
                // Update last checked time
                const now = new Date();
                document.getElementById('last-checked').textContent = now.toLocaleString();
                
                // Update overall status
                const overallStatus = document.getElementById('overall-status');
                const statusIcon = overallStatus.querySelector('.status-icon i');
                
                if (data.status === 'operational') {
                    overallStatus.querySelector('h3').textContent = 'All Systems Operational';
                    statusIcon.className = 'fas fa-check-circle';
                    overallStatus.style.backgroundColor = 'rgba(0, 204, 102, 0.1)';
                } else if (data.status === 'degraded') {
                    overallStatus.querySelector('h3').textContent = 'Partial Outage';
                    statusIcon.className = 'fas fa-exclamation-triangle';
                    overallStatus.style.backgroundColor = 'rgba(255, 153, 0, 0.1)';
                } else {
                    overallStatus.querySelector('h3').textContent = 'Major Outage';
                    statusIcon.className = 'fas fa-times-circle';
                    overallStatus.style.backgroundColor = 'rgba(255, 51, 51, 0.1)';
                }
                
                // Update stats
                document.getElementById('uptime').textContent = formatUptime(data.uptime);
                document.getElementById('api-ping').textContent = `${data.api_response_time}ms`;
                document.getElementById('server-count').textContent = data.servers.toLocaleString();
                document.getElementById('user-count').textContent = data.users.toLocaleString();
                
                // Update component statuses
                updateComponentStatus('bot', data.components.bot);
                updateComponentStatus('api', data.components.api);
                updateComponentStatus('music', data.components.music);
                updateComponentStatus('database', data.components.database);
                
                // Update charts
                updateCharts(data.metrics);
                
                // Update incident history
                updateIncidents(data.incidents);
                
            } catch (error) {
                console.error('Error fetching status:', error);
                document.getElementById('last-checked').textContent = 'Error loading data';
            }
        }
        
        // Function to update component status
        function updateComponentStatus(component, data) {
            const card = document.getElementById(`${component}-status`);
            const dot = card.querySelector('.status-dot');
            const latencyElement = card.querySelector('.latency');
            
            // Update status dot
            dot.className = 'status-dot ' + data.status;
            
            // Update latency
            latencyElement.textContent = `Latency: ${data.latency}ms`;
            
            // Update card color based on status
            if (data.status === 'operational') {
                card.style.borderLeft = '4px solid #00cc66';
            } else if (data.status === 'degraded') {
                card.style.borderLeft = '4px solid #ff9900';
            } else {
                card.style.borderLeft = '4px solid #ff3333';
            }
        }
        
        // Function to update charts
        function updateCharts(metrics) {
            // Response Time Chart
            const responseCtx = document.getElementById('responseTimeChart').getContext('2d');
            if (window.responseTimeChart) {
                window.responseTimeChart.destroy();
            }
            window.responseTimeChart = new Chart(responseCtx, {
                type: 'line',
                data: {
                    labels: metrics.response_times.labels,
                    datasets: [{
                        label: 'API Response Time (ms)',
                        data: metrics.response_times.data,
                        borderColor: '#4a6cf7',
                        backgroundColor: 'rgba(74, 108, 247, 0.1)',
                        borderWidth: 2,
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Response Time History (Last 24 Hours)'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Milliseconds'
                            }
                        }
                    }
                }
            });
            
            // Memory Usage Chart
            const memoryCtx = document.getElementById('memoryUsageChart').getContext('2d');
            if (window.memoryUsageChart) {
                window.memoryUsageChart.destroy();
            }
            window.memoryUsageChart = new Chart(memoryCtx, {
                type: 'line',
                data: {
                    labels: metrics.memory_usage.labels,
                    datasets: [{
                        label: 'Memory Usage (MB)',
                        data: metrics.memory_usage.data,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        tension: 0.1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Memory Usage History (Last 24 Hours)'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Megabytes'
                            }
                        }
                    }
                }
            });
        }
        
        // Function to update incident history
        function updateIncidents(incidents) {
            const timeline = document.getElementById('incident-timeline');
            
            if (incidents.length === 0) {
                timeline.innerHTML = `
                    <div class="timeline-item">
                        <div class="timeline-marker operational"></div>
                        <div class="timeline-content">
                            <h3>No recent incidents</h3>
                            <p>All systems have been running smoothly.</p>
                            <span class="timeline-date">${new Date().toLocaleString()}</span>
                        </div>
                    </div>
                `;
                return;
            }
            
            timeline.innerHTML = '';
            
            incidents.forEach(incident => {
                let statusClass = '';
                let statusIcon = '';
                
                if (incident.status === 'resolved') {
                    statusClass = 'operational';
                    statusIcon = '<i class="fas fa-check"></i>';
                } else if (incident.status === 'monitoring') {
                    statusClass = 'degraded';
                    statusIcon = '<i class="fas fa-exclamation-triangle"></i>';
                } else {
                    statusClass = 'outage';
                    statusIcon = '<i class="fas fa-times"></i>';
                }
                
                const incidentDate = new Date(incident.timestamp);
                const formattedDate = incidentDate.toLocaleString();
                
                timeline.innerHTML += `
                    <div class="timeline-item">
                        <div class="timeline-marker ${statusClass}">${statusIcon}</div>
                        <div class="timeline-content">
                            <h3>${incident.title}</h3>
                            <p>${incident.description}</p>
                            <span class="timeline-date">${formattedDate}</span>
                        </div>
                    </div>
                `;
            });
        }
        
        // Initial load
        updateStatus();
        
        // Refresh every 30 seconds
        setInterval(updateStatus, 30000);