function loadJSON(callback) {
    fetch('https://api.zuru.pistoncube.com.ar/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos obtenidos de la API:', data);

            // Validar que los datos existen antes de usarlos
            if (data.discord) {
                callback(data.discord);
            } else {
                console.error('Los datos de Discord no están disponibles en la respuesta.');
            }
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
}

// Usar la función para actualizar los elementos del DOM
loadJSON(function (discordData) {
    document.getElementById('servers').textContent = discordData.servers || '0';
    document.getElementById('users').textContent = discordData.users || '0';
});
