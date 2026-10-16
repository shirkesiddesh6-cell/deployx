# DeployX — Interview Preparation

## 1. Tell me about DeployX

DeployX is a self-hosted application deployment and monitoring platform I built to practice real DevOps workflows.

It's a full-stack web app:
- Frontend in HTML/CSS/JavaScript
- Backend in Node.js and Express
- PostgreSQL for storage
- Nginx as reverse proxy
- Docker for containerization
- Kubernetes (Minikube) for orchestration
- Prometheus and Grafana for monitoring
- GitHub Actions for CI/CD

Through this project, I learned how a web application moves from local development to a deployed, monitored environment.

---

## 2. What problems did you face?

Five real problems:

1. **Nginx crash loop** — pod started before the frontend service DNS was ready. Fixed by deleting and letting Kubernetes recreate the pod.

2. **Prometheus operator restarts** — health probe timeout was 1 second, too short. Patched to 5 seconds.

3. **Docker WSL integration lost** — after Windows restart, tools weren't found. Re-enabled integration in Docker Desktop.

4. **CI pipeline failed** — `.env` missing in GitHub runner. Added a dummy `.env` step in the workflow.

5. **metrics-server showed 0/1** — needed 2 minutes to warm up. Waited, then it worked.

Each problem taught me something about Kubernetes, Docker, or networking.

---

## 3. What did you learn?

- How Kubernetes handles pod startup order and DNS
- How health probes work — timeout values matter
- How to debug CI/CD pipelines
- How Prometheus scrapes metrics from Kubernetes
- How Nginx reverse proxy routes traffic to services
- How to troubleshoot step by step using logs and events

Most importantly: **deployment is not just code — it's containers, networking, configuration, and monitoring.**

---

## 4. Why Docker?

Docker packages the app with all dependencies so it runs the same way everywhere.

I used it to containerize the frontend, backend, Nginx, and PostgreSQL — all as separate containers.

---

## 5. Why Kubernetes?

Kubernetes manages containers — restarts failed ones, scales them, and provides service discovery.

I used Minikube locally to practice deployments, services, and monitoring.

---

## 6. Why Nginx?

Nginx acts as a reverse proxy — receives incoming requests and forwards them to the right backend service.

In DeployX, it routes `/` to the frontend and `/api` to the Node.js backend.

---

## 7. Why PostgreSQL?

DeployX needs a relational database to store structured deployment data. PostgreSQL is reliable, open source, and integrates well with Node.js.

---

## 8. What was your role?

I worked on the entire DevOps pipeline:
- Dockerized the application
- Deployed on Kubernetes
- Configured Nginx reverse proxy
- Set up Prometheus and Grafana
- Built CI/CD with GitHub Actions
- Wrote backend tests
- Troubleshot deployment issues

---

## 9. What would you improve?

- Add HTTPS with Let's Encrypt
- Move from Minikube to a real cloud cluster
- Add alerting rules in Grafana
- Add more test coverage
- Use Helm instead of raw YAML

---

## 10. If you don't know something

Say: "I have basic exposure to that, but I haven't worked deeply with that feature yet. I understand the concept and I'm learning it."
