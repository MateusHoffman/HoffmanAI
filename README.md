# HoffmanAI

## Subir

```bash
docker compose up -d --build
```

## Build (prod)

```bash
docker compose build
```

## Deploy (Fly.io)

```bash
fly deploy -c apps/api/fly.toml --dockerfile apps/api/Dockerfile
fly deploy -c apps/web/fly.toml --dockerfile apps/web/Dockerfile
```
