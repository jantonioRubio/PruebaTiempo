self.addEventListener('fetch', (event) => {
  // Verifica si la solicitud coincide con la URL de la API de OpenWeatherMap
  if (event.request.url.startsWith('https://api.openweathermap.org/')) {
    console.log('Fetching weather data:', event.request.url);
    event.respondWith(
      // Intenta buscar la respuesta en la caché
      caches.match(event.request).then((response) => {
        // Si se encuentra en caché, devuelve la respuesta almacenada
        if (response) {
          console.log('Response found in cache:', event.request.url);
          return response;
        }

        // Si no se encuentra en caché, realiza la solicitud a la API y almacena la respuesta en caché
        return fetch(event.request).then((networkResponse) => {
          // Clona la respuesta para poder almacenarla en caché y devolverla
          const clonedResponse = networkResponse.clone();

          caches.open('api-cache').then((cache) => {
            // Almacena la respuesta en caché para futuras solicitudes
            cache.put(event.request, clonedResponse);
          });

          console.log('Fetched from network:', event.request.url);

          return networkResponse;
        });
      })
    );
  }
});
