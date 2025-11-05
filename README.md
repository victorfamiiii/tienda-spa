# Tienda SPA (Proyecto IA)

Aplicación Single Page (SPA) estática que muestra productos de una tienda virtual, permite añadirlos al carrito y contiene páginas informativas. Incluye prompts para generar imágenes mediante IA y SVGs de ejemplo que incorporan esos prompts como descripción accesible.

Características principales:

- Listado de productos con imágenes (SVGs de ejemplo).
- Carrito persistente en localStorage.
- Páginas: Inicio, Mapa, Métodos de pago y envío, Carrito, Contacto.
- Navegación con iconos (metáforas) en lugar de texto donde es posible.
- Docker + nginx para servir la web.
- Plantilla para usar `cloudflared` y crear un túnel hacia el servidor local.

Cómo usar (resumen):

1. Construir y levantar con Docker Compose:

```bash
cd tienda-spa
docker compose up --build -d
```

2. Abrir la aplicación en http://localhost:8080

3. Configurar Cloudflare Tunnel:
- Opción recomendada: crea un túnel en Cloudflare y obtén un token (documentado en Cloudflare). Luego exporta la variable de entorno `CLOUDFLARED_TUNNEL_TOKEN` antes de levantar `docker compose`.

Ejemplo (macOS zsh):

```bash
export CLOUDFLARED_TUNNEL_TOKEN="<TU_TOKEN_AQUI>"
docker compose up --build -d
```

Si no quieres usar Cloudflare Tunnel ahora, el servicio `cloudflared` no impedirá que la web se sirva localmente.

Generar/usar imágenes IA:

- He incluido `prompts.txt` con los prompts usados para las imágenes.
- Hay un script `generate_images.py` que crea SVGs de ejemplo a partir de esos prompts.
- Para sustituir las imágenes por salidas reales de una IA (DALL·E, Stable Diffusion, Midjourney, etc.), genera las imágenes con la IA, descarga los ficheros y reemplaza los archivos en `images/` conservando el mismo nombre de fichero.

Compatibilidad con PNG y SVG:

- La SPA acepta imágenes en formatos PNG y SVG (u otros que el navegador soporte). Puedes usar imágenes .png generadas por una IA y colocarlas en `images/`.
- El script `generate_images.py` intentará generar archivos PNG si encuentra la librería Pillow (PIL). Si no hay Pillow, el script generará SVGs como fallback.


Notas sobre seguridad y producción:

- Protege el token del túnel (no lo incluyas en repositorio público).
- Para producción, configura HTTPS y un dominio en Cloudflare.

Si quieres que añada integración con una API de generación de imágenes (por ejemplo, un script que llame a la API de OpenAI o a una instancia local de Stable Diffusion), dime cuál prefieres y lo añado.
