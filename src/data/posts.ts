export interface PostSection {
  title?: string;
  body: string[];
  code?: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  categoryColor: 'green' | 'amber' | 'blue' | 'red';
  excerpt: string;
  readTime: string;
  sections: PostSection[];
}

export const posts: Post[] = [
  {
    slug: 'kubernetes-guide',
    title: 'Kubernetes for DevOps Engineers: The Practical Guide',
    date: '2024-03-15',
    category: 'Kubernetes',
    categoryColor: 'green',
    excerpt: 'Stop memorizing kubectl commands. Learn why the pod actually crashed at 3AM.',
    readTime: '8 min read',
    sections: [
      {
        body: [
          "Everyone learns kubectl get pods. Nobody teaches you why your pod is in CrashLoopBackOff at 3AM. This post is the practical Kubernetes guide I wish I had when I started.",
          "We're going to cover the mental model you need, the commands that actually matter, and the debugging workflow that will save you from panic-scrolling logs at midnight.",
        ],
      },
      {
        title: 'The mental model you need',
        body: [
          "Kubernetes is not just a container orchestrator. It's a declarative state machine. You declare what you want, and the control plane works to make reality match your declaration.",
          "This means: stop thinking about running commands. Start thinking about declaring desired state. When something breaks, ask 'what does Kubernetes think the desired state is, and why is it different from reality?'",
        ],
      },
      {
        title: 'The debug workflow',
        body: [
          "When a pod is broken, follow this chain: kubectl describe pod → kubectl logs → kubectl exec. In that order. Always.",
          "describe gives you events and status. logs gives you application output. exec lets you get inside and poke around.",
        ],
        code: `# Step 1: What's the pod's status and events?
kubectl describe pod <pod-name> -n <namespace>

# Step 2: What is the app saying?
kubectl logs <pod-name> -n <namespace> --previous

# Step 3: Get inside (if container is running)
kubectl exec -it <pod-name> -n <namespace> -- /bin/sh`,
      },
      {
        title: 'Resources and limits: the silent killer',
        body: [
          "OOMKilled. If you haven't seen this, you will. It means your container exceeded its memory limit and Kubernetes killed it. Set resource requests and limits on everything. No exceptions.",
          "Requests are what the scheduler uses to place your pod. Limits are the hard cap. Set limits too low and it gets OOMKilled. Find the right balance with kubectl top pod.",
        ],
      },
    ],
  },
  {
    slug: 'docker-multistage',
    title: 'Docker Multi-Stage Builds That Actually Cut Your Image Size',
    date: '2024-02-28',
    category: 'Docker',
    categoryColor: 'amber',
    excerpt: "Your 2GB Docker image is a problem. Here's how to slim it down to 50MB.",
    readTime: '6 min read',
    sections: [
      {
        body: [
          "I've seen production Docker images that are 4GB. Images that take 8 minutes to pull. Images that include the entire build toolchain, debug tools, test dependencies — all shipped to production.",
          "Multi-stage builds solve this. You build in one stage with all the tools you need, then copy only the output into a minimal final image. Let's do it properly.",
        ],
      },
      {
        title: 'The before: a naive Dockerfile',
        body: [
          "A typical bad Dockerfile installs everything in one layer, builds, and ships the whole thing. Result: a bloated image with node_modules, source files, and every dev tool you ever touched.",
        ],
        code: `FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
# Result: ~1.2GB image. Oops.`,
      },
      {
        title: 'The after: multi-stage',
        body: [
          "Separate the build stage from the runtime stage. Only copy what's needed to run the application in production.",
        ],
        code: `# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime only
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
# Result: ~85MB. Much better.`,
      },
      {
        title: 'Go even smaller with distroless',
        body: [
          "Alpine is good. Distroless is better. Google's distroless images contain only the runtime — no shell, no package manager, no extra tools. Smaller attack surface. Smaller image.",
          "The tradeoff: you can't kubectl exec into it and poke around. That's a feature, not a bug — immutable containers with logs going to a logging system don't need a shell.",
        ],
      },
    ],
  },
  {
    slug: 'github-actions-cicd',
    title: 'GitHub Actions: Build Your CI/CD Pipeline in 10 Minutes',
    date: '2024-02-10',
    category: 'CI/CD',
    categoryColor: 'blue',
    excerpt: 'From zero to automated deployments. No Jenkins required.',
    readTime: '10 min read',
    sections: [
      {
        body: [
          "Jenkins is powerful. Jenkins is also a second job. GitHub Actions gives you 80% of what Jenkins does with 20% of the operational overhead. For most teams, that's the right tradeoff.",
          "Here's a complete CI/CD pipeline: lint, test, build Docker image, push to registry, deploy to Kubernetes.",
        ],
      },
      {
        title: 'The workflow file',
        body: [
          "Actions are defined in .github/workflows/. Each workflow is a YAML file. Triggers, jobs, steps. Start with the test job.",
        ],
        code: `# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test`,
      },
      {
        title: 'Build and push the image',
        body: [
          "After tests pass, build the Docker image and push to GitHub Container Registry. Use the commit SHA as the image tag — never use 'latest' in production.",
        ],
        code: `  build-push:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/\${{ github.repository }}:\${{ github.sha }}`,
      },
      {
        title: 'Deploy to Kubernetes',
        body: [
          "With the image pushed, update the deployment. kubectl set image is quick and dirty. For production, use ArgoCD and update the image tag in your Helm values — let GitOps do the work.",
          "Store your kubeconfig as a GitHub Actions secret. Never hardcode credentials in workflow files.",
        ],
      },
    ],
  },
  {
    slug: 'terraform-state',
    title: "Terraform State Management: Don't Lose Your Infrastructure",
    date: '2024-01-22',
    category: 'Terraform',
    categoryColor: 'red',
    excerpt: 'Local state files are ticking time bombs. Here is the right way to manage Terraform state.',
    readTime: '7 min read',
    sections: [
      {
        body: [
          "Terraform state is the source of truth for your infrastructure. Lose it, corrupt it, or have two people modify it at once and you're in for a bad day. Possibly a very expensive bad day.",
          "If you're still using local state files, stop. Right now. Here's what to do instead.",
        ],
      },
      {
        title: 'Remote state with S3 + DynamoDB',
        body: [
          "The standard AWS pattern: store state in S3 for durability and versioning, use DynamoDB for state locking to prevent concurrent applies.",
        ],
        code: `terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/main.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}`,
      },
      {
        title: 'Workspaces for multiple environments',
        body: [
          "Use workspaces to manage dev/staging/prod with the same code. Each workspace has its own isolated state file. One repository, multiple environments.",
        ],
        code: `# Create and switch to a workspace
terraform workspace new prod
terraform workspace select prod

# Reference workspace in your config
resource "aws_instance" "app" {
  instance_type = terraform.workspace == "prod" ? "t3.large" : "t3.micro"
}`,
      },
      {
        title: 'Protect critical resources',
        body: [
          "Add lifecycle rules. Set prevent_destroy = true on databases, state buckets, and anything that would cause an outage if accidentally deleted.",
          "Always run terraform plan before apply. Count the destroys. If you see unexpected destroys — stop. Figure out why. Then proceed.",
        ],
      },
    ],
  },
];
