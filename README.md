# Myntraa – Cloud-Native Fashion Storefront

A modern, Myntra-inspired fashion e-commerce application built with **React, Vite, Node.js, and Express**. The project includes a responsive product catalogue, search and filtering, product details, wishlist, shopping cart, coupon validation, authentication, theme switching, and a seeded product collection.

The project also demonstrates containerization, CI/CD automation, Kubernetes orchestration, persistent storage, ingress routing, and application autoscaling.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Run Locally](#run-locally)
- [Production Build](#production-build)
- [Docker Deployment](#docker-deployment)
- [Database and Persistence](#database-and-persistence)
- [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Kubernetes Deployment with Kind](#kubernetes-deployment-with-kind)
- [Kubernetes Architecture](#kubernetes-architecture)
- [Security Considerations](#security-considerations)

---

## Features

- Responsive fashion storefront
- Product catalogue and product details
- Search, filtering, and product discovery
- Shopping cart and wishlist
- Coupon validation
- User authentication
- Light and dark theme
- MySQL database integration
- Docker-based application deployment
- GitHub Actions CI/CD automation
- Kubernetes deployment using Kind
- Persistent storage for MySQL
- NGINX Ingress Controller
- Horizontal Pod Autoscaler (HPA)
- Vertical Pod Autoscaler (VPA)

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Backend | Node.js, Express |
| Database | MySQL |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Security Scanning | Trivy, OWASP Dependency-Check |
| Code Quality | SonarQube |
| Orchestration | Kubernetes, Kind |
| Kubernetes CLI | kubectl |
| Traffic Management | NGINX Ingress Controller |
| Autoscaling | HPA, VPA |
| Infrastructure | AWS EC2, Linux |

---

## Project Structure

```text
myntraa/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   └── lib/
├── server/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── data/
│       ├── products.js
│       └── schema.sql
├── manifests/
│   ├── 01-namespace.yml
│   ├── 02-pv.yml
│   ├── ...
│   └── 11-vpa.yml
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Run Locally

### Prerequisites

- Node.js
- npm
- MySQL (optional for demo mode)

### Installation

```bash
git clone https://github.com/<YOUR_USERNAME>/myntraa.git

cd myntraa

npm install

cp .env.example .env

npm run dev
```

On Windows:

```powershell
copy .env.example .env
```

Open the application:

```text
http://localhost:5173
```

### API Configuration

The frontend uses `/api` for backend requests.

The API should run on port `3001`. Alternatively, configure the API URL in `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

---

## Production Build

Build the frontend:

```bash
npm run build
```

Start the production server:

```bash
NODE_ENV=production npm start
```

The production server serves the frontend build from `dist` and exposes the API on port `3001`.

---

## Docker Deployment

### Build the Docker Image

```bash
docker build -t myntraa:latest .
```

### Run the Container

```bash
docker run -d \
  --name myntraa \
  -p 3001:3001 \
  --env-file .env \
  myntraa:latest
```

### Docker Compose Deployment

Configure your `.env` file with the required application and database credentials.

Start the application and MySQL:

```bash
docker compose up --build -d
```

Verify running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

---

## Database and Persistence

The application supports two operating modes:

**Demo mode**
- Uses an in-memory store when database configuration is unavailable.
- Supports demo authentication and cart operations.

**MySQL mode**
- Stores user information in the `users` table.
- Creates the required database tables on startup.
- Supports cart persistence and checkout.
- Stores orders and order items in MySQL.

Database tables:

- `users`
- `cart_items`
- `orders`
- `order_items`

Database schema:

```text
server/data/schema.sql
```

Products are seeded in `server.js` and mirrored in `server/data/products.js`.

---

## CI/CD with GitHub Actions

The CI/CD workflow is maintained at:

```text
.github/workflows/ci-cd.yml
```

### Pipeline Workflow

The pipeline runs on configured pushes and pull requests targeting the `main` branch.

Typical pipeline stages:

1. Checkout source code.
2. Install project dependencies.
3. Run application checks and tests.
4. Perform security scanning with Trivy.
5. Run code quality analysis using SonarQube.
6. Build the Docker image.
7. Scan the Docker image.
8. Push the image to Docker Hub.
9. Optionally deploy using Docker Compose on a self-hosted runner.

### Required GitHub Secrets

Configure these secrets under:

`Repository → Settings → Secrets and variables → Actions`

| Secret Name | Purpose |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `JWT_SECRET` | Application authentication secret |
| `MYSQL_ROOT_PASSWORD` | MySQL root password |
| `MYSQL_PASSWORD` | MySQL application password |
| `SONAR_TOKEN` | SonarQube authentication token |
| `SONAR_HOST_URL` | SonarQube server URL |
| `NVD_API_KEY` | OWASP Dependency-Check NVD API key |

Only configure secrets that are actually referenced by your workflow.

### Docker Hub Images

Repository:

```text
vjstylose/myntraa
```

Image tags:

| Tag | Description |
|---|---|
| `latest` | Latest successful build published to this tag |
| `build-<run_number>` | Image associated with a specific workflow run |

### Pull the Published Image

```bash
docker pull vjstylose/myntraa:latest
```

### Deploy Using Docker Compose

Ensure the server has the required environment variables configured.

```bash
docker compose pull

docker compose up -d
```

---

# Kubernetes Deployment with Kind

This project also includes a Kubernetes deployment using **Kind (Kubernetes in Docker)** and `kubectl`.

The objective is to deploy the Myntraa application and MySQL database inside a Kubernetes cluster and manage the application using Kubernetes resources.

## Kubernetes Architecture

The deployment includes:

- Kind cluster with one control-plane node and multiple worker nodes.
- Separate namespace for the application and database resources.
- PersistentVolume and PersistentVolumeClaim for MySQL storage.
- Kubernetes Secrets for sensitive configuration.
- ConfigMaps for non-sensitive configuration.
- MySQL Deployment and Service.
- Myntraa application Deployment and Service.
- NGINX Ingress Controller for external HTTP routing.
- Horizontal Pod Autoscaler for application scaling.
- Vertical Pod Autoscaler for resource recommendations and management.

## Step 1: Prepare the Ubuntu Instance

Update the system:

```bash
sudo apt-get update

sudo apt-get upgrade -y
```

Install Docker:

```bash
sudo apt-get install docker.io -y
```

Enable Docker:

```bash
sudo systemctl enable --now docker
```

Add the current user to the Docker group:

```bash
sudo usermod -aG docker $USER
```

Apply the new group membership by logging out and logging back in, or run:

```bash
newgrp docker
```

Verify Docker:

```bash
docker --version

docker ps
```

## Step 2: Install Kind

Download the Kind binary:

```bash
[ "$(uname -m)" = "x86_64" ] && \
curl -Lo ./kind \
https://kind.sigs.k8s.io/dl/v0.33.0/kind-linux-amd64
```

Make it executable:

```bash
chmod +x ./kind
```

Move it to the system binary directory:

```bash
sudo mv ./kind /usr/local/bin/kind
```

Verify:

```bash
kind version
```

## Step 3: Install kubectl

Download the latest stable kubectl binary:

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

Make it executable:

```bash
chmod +x kubectl
```

Create a local binary directory:

```bash
mkdir -p ~/.local/bin
```

Move kubectl:

```bash
mv ./kubectl ~/.local/bin/kubectl
```

Add the directory to PATH:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc

source ~/.bashrc
```

Verify:

```bash
which kubectl

kubectl version --client
```

## Step 4: Create the Kind Cluster

The cluster configuration is maintained in:

```text
cluster.yml
```

Create the cluster:

```bash
kind create cluster \
  --config cluster.yml \
  --name my-cluster
```

Verify:

```bash
kubectl get nodes -o wide
```

**Important:** If you want to access the Ingress Controller through the EC2 public IP, configure the appropriate host port mappings (80 and 443) in the Kind cluster configuration before creating the cluster. Kind node port mappings are configured through `extraPortMappings`.

## Step 5: Create Kubernetes Namespaces

Namespaces logically separate application resources.

Manifest:

```text
manifests/01-namespace.yml
```

Apply:

```bash
kubectl apply -f manifests/01-namespace.yml
```

Verify:

```bash
kubectl get namespaces
```

## Step 6: Create PersistentVolume

Create a PersistentVolume to provide storage for MySQL.

Manifest:

```text
manifests/02-pv.yml
```

Apply:

```bash
kubectl apply -f manifests/02-pv.yml
```

Verify:

```bash
kubectl get pv
```

## Step 7: Create PersistentVolumeClaim

A PersistentVolumeClaim requests storage from an available PersistentVolume.

Apply the PVC manifest:

```bash
kubectl apply -f manifests/
```

Alternatively, apply the specific PVC manifest if it is maintained separately.

Verify:

```bash
kubectl get pv

kubectl get pvc -n mytraa-ns
```

The PVC should reach the `Bound` state before deploying MySQL.

> Note: Ensure the PV and PVC have compatible capacity, access modes, storage class, and volume selectors. For local Kind storage, the hostPath/node affinity configuration must also be appropriate for the selected node.

## Step 8: Create Kubernetes Secrets

Kubernetes Secrets store sensitive configuration such as database passwords.

Manifest:

```text
manifests/04-secret.yml
```

Apply:

```bash
kubectl apply -f manifests/04-secret.yml
```

Verify:

```bash
kubectl get secrets -n mytraa-ns
```

Base64 encoding is not encryption. Protect your Secret manifests and use an appropriate secret-management solution for production.

## Step 9: Create ConfigMap

ConfigMaps store non-sensitive configuration, such as:

- Database name
- Database host
- Database port
- Application environment

Apply:

```bash
kubectl apply -f manifests/05-configmap.yml
```

Verify:

```bash
kubectl get configmap -n mytraa-ns
```

## Step 10: Deploy MySQL

Create the MySQL Deployment and Service.

The Deployment manages MySQL pods, while the Service provides a stable internal network endpoint.

Apply:

```bash
kubectl apply -f manifests/06-mysql.yml
```

Verify:

```bash
kubectl get pods -n mytraa-ns

kubectl get svc -n mytraa-ns

kubectl get pvc -n mytraa-ns
```

Check MySQL logs:

```bash
kubectl logs -n mytraa-ns deployment/mysql-depo
```

## Step 11: Deploy the Myntraa Application

Create the application Deployment.

The Deployment manages application replicas and ensures the desired number of pods are running.

Apply:

```bash
kubectl apply -f manifests/07-app.yml
```

Verify:

```bash
kubectl get deployments -n mytraa-ns

kubectl get pods -n mytraa-ns -o wide
```

## Step 12: Create the Application Service

Create a ClusterIP Service to expose the application internally inside the Kubernetes cluster.

Apply:

```bash
kubectl apply -f manifests/08-service.yml
```

Verify:

```bash
kubectl get svc -n mytraa-ns

kubectl get endpoints -n mytraa-ns
```

The Service should have healthy application pod endpoints.

## Step 13: Install NGINX Ingress Controller

The NGINX Ingress Controller manages HTTP routing to Kubernetes Services.

Install the controller using the Kind-specific deployment manifest:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0/deploy/static/provider/kind/deploy.yaml
```

Wait for the controller to become ready:

```bash
kubectl wait \
  --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=180s
```

Verify:

```bash
kubectl get pods -n ingress-nginx

kubectl get svc -n ingress-nginx
```

## Step 14: Configure Ingress

Ingress provides HTTP routing to the application using URL paths.

Manifest:

```text
manifests/09-ingress.yml
```

Apply:

```bash
kubectl apply -f manifests/09-ingress.yml
```

Verify:

```bash
kubectl get ingress -A

kubectl describe ingress -n mytraa-ns mytraa-ing
```

Example application URL:

```text
http://<EC2-PUBLIC-IP>/mytraa
```

The Ingress configuration uses a path prefix and rewrite rules to route requests to the application.

Make sure the application supports the rewritten request path.

## Step 15: Configure Horizontal Pod Autoscaler (HPA)

HPA automatically adjusts the number of application pod replicas based on resource utilization or other supported metrics.

Manifest:

```text
manifests/10-hpa.yml
```

Apply:

```bash
kubectl apply -f manifests/10-hpa.yml
```

Verify:

```bash
kubectl get hpa -n mytraa-ns

kubectl describe hpa -n mytraa-ns
```

Check resource metrics:

```bash
kubectl top nodes

kubectl top pods -n mytraa-ns
```

> Metrics Server must be installed and working for CPU and memory-based HPA metrics.

## Step 16: Install Vertical Pod Autoscaler (VPA)

VPA recommends appropriate CPU and memory resource requests and limits based on observed container resource usage.

In this project, VPA is configured for the MySQL workload.

Clone the official Kubernetes autoscaler repository:

```bash
cd ~

git clone https://github.com/kubernetes/autoscaler.git

cd autoscaler/vertical-pod-autoscaler
```

Fetch available tags:

```bash
git fetch --all --tags
```

Checkout the VPA 1.8 release:

```bash
git checkout vpa-release-1.8
```

Verify the selected branch:

```bash
git branch --show-current
```

Install VPA:

```bash
./hack/vpa-up.sh
```

Verify VPA CustomResourceDefinitions:

```bash
kubectl get crd | grep verticalpodautoscaler
```

Verify VPA components:

```bash
kubectl get pods -n kube-system | grep vpa
```

Expected components:

- vpa-recommender
- vpa-updater
- vpa-admission-controller

Apply the MySQL VPA configuration:

```bash
cd ~/myntraa/manifests

kubectl apply -f 11-vpa.yml
```

Verify:

```bash
kubectl get vpa -n mytraa-ns

kubectl describe vpa mysql-vpa -n mytraa-ns
```

For initial observation, use:

```yaml
updatePolicy:
  updateMode: "Off"
```

`Off` mode provides recommendations without automatically changing existing pod resources.

> VPA recommendations require sufficient resource-usage history. For a stateful database such as MySQL, review recommendations carefully before enabling automatic updates.

---

## Useful Kubernetes Commands

Check all resources in the application namespace:

```bash
kubectl get all -n mytraa-ns
```

Check pods across all namespaces:

```bash
kubectl get pods -A -o wide
```

Check application logs:

```bash
kubectl logs -n mytraa-ns deployment/mytraa-depo
```

Describe a pod:

```bash
kubectl describe pod <POD_NAME> -n mytraa-ns
```

Check Services:

```bash
kubectl get svc -A
```

Check Ingress:

```bash
kubectl get ingress -A
```

Check autoscalers:

```bash
kubectl get hpa -A

kubectl get vpa -A
```

---

## Security Considerations

Before using this project in a public production environment:

- Replace demo credentials and use strong secrets.
- Never commit `.env` files or real credentials.
- Use HTTPS and TLS certificates.
- Integrate a production-grade payment gateway.
- Implement robust validation, rate limiting, and authentication.
- Configure proper Kubernetes RBAC and NetworkPolicies.
- Use encrypted secret management.
- Configure database backups and persistent storage appropriately.
- Monitor application health, logs, and resource utilization.
- Review container images and dependencies for vulnerabilities.

---

## Author

**Vivek Jhariya**

DevOps & Cloud Engineering | Docker | Kubernetes | AWS | Jenkins | GitHub Actions

