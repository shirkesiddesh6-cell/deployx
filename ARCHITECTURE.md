# DeployX — Architecture

## Overview

DeployX is a full-stack web application deployed on Kubernetes with monitoring. The architecture follows a standard three-tier pattern with reverse proxy and observability layers.

## Diagram

    USER
      |
      v
    Frontend (HTML/CSS/JS)
      |
      v
    Nginx (Reverse Proxy)
      |
      v
    Node.js API (Express)
      |
      +--> PostgreSQL (Database)
      |
      +--> Kubernetes (Minikube)
              |
              v
          Prometheus + Grafana (Monitoring)

## Components

### Frontend
- Pure HTML, CSS, JavaScript
- Served by Nginx container
- Talks to backend via REST API

### Nginx (Reverse Proxy)
- Receives all incoming traffic
- Routes / to frontend
- Routes /api/* to backend
- Handles static file serving

### Backend (Node.js + Express)
- REST API for deployments CRUD
- Connects to PostgreSQL
- Validates input
- Returns JSON responses

### PostgreSQL
- Stores deployment records
- Persistent volume (PVC) in Kubernetes
- Init script creates schema on first start

### Kubernetes (Minikube)
- All services deployed as Deployments + Services
- Namespace: default
- ConfigMap for non-secret config
- Secret for database credentials
- PVC for PostgreSQL persistence

### Monitoring
- Prometheus scrapes metrics from Kubernetes
- Grafana visualizes metrics in dashboards
- Deployed via Helm chart kube-prometheus-stack

### CI/CD
- GitHub Actions pipeline
- Runs on every push to main
- Steps: install deps, run tests, validate Docker builds

## Data Flow

1. User opens browser and hits Nginx service
2. Nginx routes request to frontend or backend
3. Backend queries PostgreSQL
4. PostgreSQL returns data
5. Backend sends JSON to frontend
6. Frontend renders it
7. Prometheus continuously scrapes metrics
8. Grafana displays metrics in dashboards

## Deployment Modes

### Local (Docker Compose)
Fast for development. Single command: docker compose up -d

### Kubernetes (Minikube)
Production-like. Uses manifests in kubernetes/ folder.

## Why This Architecture

- Separation of concerns — each component has one job
- Reverse proxy — Nginx handles routing and can later add SSL
- Persistent storage — PostgreSQL data survives pod restarts
- Observability — Prometheus + Grafana give real-time insight
- Portable — works on Docker Compose and Kubernetes without code changes
