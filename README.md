# Quennie Portfolio

Portfolio fotográfico de Quennie con versiones visuales independientes y reparto estable de tráfico.

## Archivos

- `index.html`: versión original de la landing; se sirve públicamente en `/v1/`.
- `v2/`: versión editorial «Pliegos», diseñada por Claude Opus 5.5.
- `api/version.js`: router 50/50 de `/` a las versiones activas, con cookie estable durante 30 días y preservación de UTMs.
- `vercel.json`: rewrites y cabeceras de versionado en Vercel.
- `mapa/index.html`: mapa interno no indexable para visualizar páginas y secciones del dominio.
- `styles.css`: dirección visual responsive y sistema de componentes.
- `script.js`: filtros de portfolio y formulario con webhook configurable y fallback por email.

## Uso local

Abre `index.html` directamente en el navegador o sirve la carpeta con:

```bash
python3 -m http.server 5173
```

Después visita `http://localhost:5173/v2/`. La ruta `/` usa el router de Vercel solo en el despliegue; en local sirve directamente la V1.

## Versiones

- `/v1/`: diseño original.
- `/v2/`: «Pliegos», dirección editorial de Claude Opus 5.5.
- `/?version=v1` o `/?version=v2`: fuerza una versión y actualiza la cookie del router.

Para añadir una versión, crea una ruta autocontenida y añádela a `ACTIVE_VERSIONS` en `api/version.js`.
