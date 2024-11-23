document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://api.zuru.pistoncube.com.ar";
    
    const statusContainer = document.querySelector(".container .text-center");

    // Función para obtener y actualizar los datos
    async function updateStatus() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Generar HTML dinámico
            const statsHtml = `
                    <h2 class="text-center mb-4">📊 Stats 📊</h2>
        <p class="text-center mb-5">Here are the current statistics for ZuruBot:</p>
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <ul class="list-group">
                            <li class="list-group-item"><strong>🔑 Bot ID:</strong> ${data.bot.id}</li>
                            <li class="list-group-item"><strong>🖥️ Operating System:</strong> ${data.system.operatingSystem}</li>
                            <li class="list-group-item"><strong>⚙️ Architecture:</strong> ${data.system.architecture}</li>
                            <li class="list-group-item"><strong>🚀 CPU:</strong> ${data.system.cpu}</li>
                            <li class="list-group-item"><strong>📟 RAM:</strong> ${data.system.ram.used} / ${data.system.ram.total} (${data.system.ram.usage})</li>
                            <li class="list-group-item"><strong>📐 Library:</strong> ${data.discord.library}</li>
                            <li class="list-group-item"><strong>🗺️ Servers:</strong> ${data.discord.servers}</li>
                            <li class="list-group-item"><strong>👥 Users:</strong> ${data.discord.users}</li>
                            <li class="list-group-item"><strong>📬 Channels:</strong> ${data.discord.channels}</li>
                            <li class="list-group-item"><strong>🏓 Bot Ping:</strong> ${data.discord.botPing}ms</li>
                            <li class="list-group-item"><strong>🌐 API Ping:</strong> ${data.discord.apiPing}</li>
                            <li class="list-group-item"><strong>⏱️ Uptime:</strong> ${data.bot.uptime}</li>
                        </ul>
                    </div>
                </div>`;

            // Actualizar el contenido
            statusContainer.innerHTML = statsHtml;
        } catch (error) {
            console.error("Error fetching data:", error);
            statusContainer.innerHTML = `<p class="text-danger">Failed to load statistics. Please try again later.</p>`;
        }
    }

    // Actualizar las estadísticas al cargar y cada 2 minutos
    updateStatus();
    setInterval(updateStatus, 2 * 60 * 1000);
});
