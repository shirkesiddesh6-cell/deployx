# Problems I Faced & Solved — DeployX

## 1. Nginx Crash Loop in Kubernetes

**Problem:** Nginx pod kept crashing with error: `host not found in upstream "frontend"`.

**Cause:** After a cluster restart, Nginx started before the frontend service DNS was ready.

**Fix:** Deleted the crashing pod with `kubectl delete pod`. Kubernetes recreated it — this time the service existed, so it started cleanly.

**Lesson:** Pod startup ordering matters in Kubernetes.

---

## 2. Prometheus Operator Restarting

**Problem:** Operator pod had 43+ restarts. Liveness and readiness probes were timing out.

**Cause:** Probes had `timeoutSeconds: 1` — too short for the operator to respond under load.

**Fix:** Patched the deployment to use `timeoutSeconds: 5`. Rollout succeeded. Operator has 0 restarts since.

**Lesson:** Health probe timeouts must match the actual response time of the service.

---

## 3. Docker WSL Integration Lost

**Problem:** After Windows restart, `docker`, `kubectl`, and `minikube` not found in Ubuntu WSL.

**Cause:** Docker Desktop's WSL integration got disabled.

**Fix:** Opened Docker Desktop → Settings → Resources → WSL Integration → enabled Ubuntu → `wsl --shutdown` → reopened.

**Lesson:** Docker Desktop must be running and integrated with the WSL distro before using containers.

---

## 4. CI Pipeline Failed on Docker Compose Validation

**Problem:** GitHub Actions failed with `.env not found`.

**Cause:** `.env` is in `.gitignore` (correctly — it has secrets), so CI didn't have it.

**Fix:** Added a step in the workflow to create a dummy `.env` before validation.

**Lesson:** CI pipelines need dummy env values for config validation — real secrets stay out of git.

---

## 5. metrics-server Showing No Data

**Problem:** metrics-server pod showed `0/1 Running` and `kubectl top` didn't work.

**Cause:** metrics-server needed 1–2 minutes after startup to collect its first set of metrics.

**Fix:** Waited 2 minutes. Readiness probe eventually passed. `kubectl top nodes` worked.

**Lesson:** Some pods need time to warm up — not every `0/1` means failure.
