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
    slug: 's3-filesystem-evolution',
    title: "S3 in 2025: AWS's Filesystem Revolution and What It Means for You",
    date: '2025-04-01',
    category: 'AWS',
    categoryColor: 'amber',
    excerpt: "S3 is no longer just object storage. Mountpoint, Express One Zone, S3 Tables, and S3 Metadata have turned it into something far more powerful — here's what changed and why it matters.",
    readTime: '12 min read',
    sections: [
      {
        body: [
          "For most of its life, S3 was a place you put files and prayed you never needed to list a bucket with 50 million objects. That era is over. The past 18 months have delivered more fundamental changes to S3 than the previous decade combined.",
          "Mountpoint turned it into a POSIX filesystem. Express One Zone made it 10x faster. S3 Tables gave it native Iceberg support. S3 Metadata made it queryable. These aren't incremental improvements — they're category expansions. Let's go through each one.",
        ],
      },
      {
        title: '1. Mountpoint for Amazon S3: S3 as a real filesystem',
        body: [
          "Mountpoint for Amazon S3 went GA in August 2023 and is arguably the most significant S3 change since versioning. It lets you mount an S3 bucket as a local directory using a FUSE driver. Your application reads and writes to a path. Under the hood, those I/O calls translate to S3 API calls.",
          "What this actually solves: ML training pipelines. Before Mountpoint, training jobs either downloaded terabytes of data to local EBS before starting, or used custom S3 client libraries in the training code itself. Mountpoint decouples storage from compute — the training job just reads from /data/training like a local disk, and Mountpoint handles the rest.",
          "The performance numbers are real. Mountpoint saturates high-bandwidth EC2 instances (100 Gbps on trn1.32xlarge) because it parallelizes GET requests automatically. Sequential reads on large files hit S3 full bandwidth. Random reads on small files are still not its sweet spot — it's not EFS.",
        ],
        code: `# Install Mountpoint
wget https://s3.amazonaws.com/mountpoint-s3-release/latest/x86_64/mount-s3.rpm
sudo yum install ./mount-s3.rpm

# Mount a bucket to a local path
mount-s3 my-training-data /data/training

# With custom options: allow other users, cache metadata
mount-s3 my-training-data /data/training \\
  --allow-other \\
  --metadata-ttl 60 \\
  --read-only

# Verify
ls -la /data/training/
df -h /data/training/`,
      },
      {
        title: 'The Mountpoint limitations you need to know',
        body: [
          "Mountpoint is optimized for read-heavy sequential workloads. It does not support random writes, appending to existing files, or full POSIX semantics (no symlinks, no hard links, no file locking). If your app needs those, EFS is still the answer.",
          "It also does not cache data locally by default — every read hits S3. For repeated reads of the same files, you want to pair it with a local cache or use the --cache flag (experimental as of early 2025). Know the access pattern before choosing it.",
          "For write-heavy workloads like log aggregation: write to local disk or EBS, flush to S3 on a schedule. Don't write through Mountpoint for high-frequency small writes.",
        ],
      },
      {
        title: '2. S3 Express One Zone: when speed matters more than redundancy',
        body: [
          "Launched at re:Invent 2023, S3 Express One Zone is a new storage class that delivers single-digit millisecond latency and up to 10x higher throughput than standard S3. The tradeoff: data lives in a single Availability Zone, not replicated across three.",
          "The use case is specific but important: latency-sensitive compute workloads that need temporary or reproducible data. ML checkpoints during training. Shuffle data in Spark jobs. Intermediate pipeline artifacts. Data you can regenerate if an AZ goes down.",
          "The bucket type is different — it's called a 'directory bucket' and uses the naming convention bucket-name--az-id--x-s3. Access works through the same S3 APIs but you explicitly specify the endpoint. Important: Express One Zone buckets are not compatible with all S3 features — no versioning, no replication, no lifecycle policies.",
        ],
        code: `# Create a directory bucket (Express One Zone)
aws s3api create-bucket \\
  --bucket my-fast-data--use1-az4--x-s3 \\
  --create-bucket-configuration DataRedundancy=SingleAvailabilityZone,Location='{Name=use1-az4,Type=AvailabilityZone}'

# Use a dedicated session for lower per-request overhead
aws s3api create-session \\
  --bucket my-fast-data--use1-az4--x-s3 \\
  --session-mode ReadWrite

# Boto3: use the express endpoint for direct access
import boto3
s3 = boto3.client(
    "s3",
    endpoint_url="https://s3express-use1-az4.us-east-1.amazonaws.com"
)
s3.put_object(Bucket="my-fast-data--use1-az4--x-s3", Key="checkpoint.bin", Body=data)`,
      },
      {
        title: '3. S3 Metadata: finally, queryable object metadata',
        body: [
          "Announced at re:Invent 2024 and rolling out through 2025, S3 Metadata solves a problem that has annoyed S3 users for years: you could not query your own bucket. To find objects matching a condition, you listed the bucket and filtered client-side — O(n) on every search, expensive at scale.",
          "S3 Metadata creates an automatically maintained table of your bucket's objects, queryable via Amazon Athena or S3 Metadata APIs. Every object's key, size, ETag, last modified, storage class, and custom metadata attributes are indexed in near real-time.",
          "What this unlocks in practice: data governance workflows that were previously batch jobs become live queries. Finding all objects modified in the last 24 hours, all objects over 10GB, all objects tagged with a specific team — these go from minutes-long S3 list operations to sub-second Athena queries.",
        ],
        code: `-- Query S3 Metadata via Athena
-- Find all objects over 1GB modified in the last 7 days
SELECT key, size, last_modified, storage_class
FROM "my-bucket-metadata"."objects"
WHERE size > 1073741824
  AND last_modified > current_timestamp - interval '7' day
ORDER BY last_modified DESC;

-- Audit: find objects without required tags
SELECT key, last_modified
FROM "my-bucket-metadata"."objects"
WHERE NOT contains(tags, 'team')
  OR NOT contains(tags, 'environment')
LIMIT 1000;`,
      },
      {
        title: '4. S3 Tables: Apache Iceberg native in S3',
        body: [
          "Also from re:Invent 2024, S3 Tables is the most architecturally significant addition. It provides natively managed Apache Iceberg tables stored in S3 — with no separate metadata catalog to run, no manual compaction jobs, no schema evolution headaches.",
          "Iceberg is the open table format that has largely won the data lakehouse wars. Before S3 Tables, using Iceberg on S3 meant managing a Glue catalog or Hive Metastore, running compaction and snapshot expiry jobs yourself, handling concurrent write coordination manually. S3 Tables makes all of that AWS's problem.",
          "The result: you create a table, define a schema, and write Parquet data via standard Iceberg APIs. AWS handles compaction, snapshot management, and catalog maintenance automatically. Query from Athena, EMR, or Apache Spark with zero configuration changes beyond the endpoint.",
        ],
        code: `# Create an S3 Table bucket and table via CLI
aws s3tables create-table-bucket \\
  --name my-analytics-tables \\
  --region us-east-1

aws s3tables create-table \\
  --table-bucket-arn arn:aws:s3tables:us-east-1:123456789:bucket/my-analytics-tables \\
  --namespace analytics \\
  --name events \\
  --format ICEBERG

# Write via PySpark (no catalog config needed)
from pyspark.sql import SparkSession
spark = SparkSession.builder \\
    .config("spark.sql.catalog.s3tablesbucket",
            "org.apache.iceberg.spark.SparkCatalog") \\
    .config("spark.sql.catalog.s3tablesbucket.catalog-impl",
            "software.amazon.s3tables.iceberg.S3TablesCatalog") \\
    .getOrCreate()

df.writeTo("s3tablesbucket.analytics.events").append()`,
      },
      {
        title: '5. How these changes make life easier day-to-day',
        body: [
          "The ML engineer no longer maintains a separate EFS cluster for training data. Mount the S3 bucket with Mountpoint on the training instance, train, unmount. Storage cost drops from EFS ($0.30/GB/month) to S3 Standard ($0.023/GB/month). For a 10TB dataset that's $2,770/month vs $230/month.",
          "The data engineer no longer writes Spark jobs to list buckets and build manifests. S3 Metadata answers those questions in seconds via SQL. The Friday afternoon 'find all raw logs from last quarter that haven't been archived' request goes from a 2-hour batch job to a 10-second Athena query.",
          "The platform team no longer manages a Hive Metastore or Glue catalog for Iceberg tables. S3 Tables handles catalog, compaction, and snapshot expiry. Operational load for running a lakehouse drops substantially.",
          "Express One Zone gives ML training jobs fast intermediate storage without the cost and complexity of a Lustre filesystem. Checkpoints that used to go to EBS (expensive, single-instance) now go to a directory bucket (cheap, accessible from any instance in the AZ).",
        ],
      },
      {
        title: 'The bigger picture: S3 as a platform, not a service',
        body: [
          "AWS is positioning S3 as the universal storage layer for every compute pattern — not just object storage. Files (Mountpoint), high-performance scratch (Express One Zone), object metadata search (S3 Metadata), structured analytics (S3 Tables). Each feature is independently useful but together they eliminate entire categories of auxiliary services.",
          "The pattern: the more you can keep data in S3 instead of moving it to purpose-built stores, the lower your egress costs, the simpler your architecture, and the fewer moving parts you maintain.",
          "The teams that will move fastest in the next two years are the ones that deeply understand what S3 can now do natively — and stop spinning up EFS clusters, Glue catalogs, and Lustre filesystems by reflex when S3 can now solve the problem more cheaply and with less operational overhead.",
        ],
      },
    ],
  },
  {
    slug: 'aws-anthropic-cybersecurity',
    title: 'AWS + Anthropic: How AI Is Reshaping Cybersecurity in 2025',
    date: '2025-03-28',
    category: 'Cloud Security',
    categoryColor: 'blue',
    excerpt: 'Claude on Bedrock is now a live security analyst. Threat detection, IR automation, and vulnerability research will never look the same.',
    readTime: '11 min read',
    sections: [
      {
        body: [
          "In late 2023, Amazon invested $4 billion into Anthropic and made Claude available through Amazon Bedrock. That deal was framed as an AI partnership. In practice, it quietly handed the security industry one of its biggest paradigm shifts in years.",
          "This isn't another blog post about 'AI will replace analysts.' It's about the specific, concrete capabilities that the AWS/Anthropic collaboration has unlocked — and why the security teams that understand this early will be the ones setting the standard.",
        ],
      },
      {
        title: '1. Claude on Bedrock as a live security analyst',
        body: [
          "The core unlock: Claude 3 and Claude 3.5 Sonnet are now accessible through Amazon Bedrock with no data sent outside your AWS environment. For regulated industries — finance, healthcare, defense — that was the blocker. It's gone.",
          "Security teams are now embedding Claude directly into their SOC pipelines. CloudTrail logs, GuardDuty findings, and VPC flow logs get fed into Claude with a structured prompt, and it returns a human-readable analysis: what happened, what it likely means, and what to check next.",
          "The signal-to-noise ratio improvement is significant. GuardDuty can fire hundreds of low-confidence alerts per day. Claude can triage all of them in seconds, surfacing the three that actually matter for a human to investigate.",
        ],
      },
      {
        title: '2. Amazon Security Lake + Claude: a new threat intelligence loop',
        body: [
          "Amazon Security Lake normalizes data from AWS services, third-party tools, and on-prem sources into the Open Cybersecurity Schema Framework (OCSF). That standardized format is exactly what makes LLM analysis tractable at scale.",
          "The emerging pattern: Security Lake as the data layer, Amazon Bedrock as the reasoning layer. A Lambda function queries Security Lake for events in a time window, passes them to Claude with a threat hunting prompt, and gets back a structured JSON report with TTPs mapped to MITRE ATT&CK.",
          "This isn't a product yet. It's a pattern that teams are building right now with the available primitives — and it's working.",
        ],
        code: `# Example: Claude-powered triage via Bedrock
import boto3, json

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")

def triage_guardduty_finding(finding: dict) -> str:
    prompt = f"""You are a senior cloud security analyst.
Analyze this GuardDuty finding and provide:
1. Severity assessment (Critical/High/Medium/Low)
2. What likely happened
3. Immediate actions required
4. MITRE ATT&CK techniques involved

Finding: {json.dumps(finding, indent=2)}"""

    response = bedrock.invoke_model(
        modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
        body=json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": prompt}]
        })
    )
    return json.loads(response["body"].read())["content"][0]["text"]`,
      },
      {
        title: '3. AI-assisted vulnerability research and patching',
        body: [
          "Anthropic's Constitutional AI training gives Claude an unusual property for security work: it reasons about intent. When you hand it a CVE description, a patch diff, and a list of your running container images, it can assess actual exploitability in your environment — not just generic CVSS scores.",
          "AWS Inspector now integrates with Bedrock-powered workflows. The discovery: teams using Claude to contextualize Inspector findings are reducing their mean time to patch critical vulnerabilities by cutting the human triage step on ~60% of findings that turn out to be non-exploitable given the actual runtime context.",
          "The shift here is subtle but important: we're moving from 'this CVE scored 9.8' to 'this CVE scored 9.8 but your security group blocks the attack path, so it's effectively a 3.2 for you specifically.'",
        ],
      },
      {
        title: '4. Automated incident response playbooks',
        body: [
          "The traditional IR playbook lives in Confluence. Someone wrote it, someone approved it, and it sits there getting stale while attackers change their techniques. Claude-backed playbooks are different — they're generated at incident time, informed by the specific signals present.",
          "The AWS pattern being adopted: EventBridge captures the security event, triggers a Step Functions workflow, one step calls Claude via Bedrock to generate a specific IR plan for the observed TTPs, another step sends that plan to PagerDuty with the on-call responder's context already populated.",
          "Discovery from teams running this in production: the generated plans reference the exact resource ARNs involved, suggest specific AWS CLI commands scoped to the affected account, and include rollback steps. Responders stop at the 'what do I do first' question because the answer is already there.",
        ],
        code: `# Step Functions task: generate IR plan
{
  "Type": "Task",
  "Resource": "arn:aws:states:::bedrock:invokeModel",
  "Parameters": {
    "ModelId": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "Body": {
      "anthropic_version": "bedrock-2023-05-31",
      "max_tokens": 2048,
      "messages": [{
        "role": "user",
        "content.$": "States.Format('Incident detected in account {}. Affected resources: {}. GuardDuty findings: {}. Generate a step-by-step IR playbook with specific AWS CLI commands.', $.accountId, $.resources, $.findings)"
      }]
    }
  },
  "ResultPath": "$.irPlan"
}`,
      },
      {
        title: '5. What Anthropic brings that other AI providers don\'t',
        body: [
          "Not all LLMs are equal for security work. Anthropic's research focus on 'honest and harmless' AI has a practical consequence: Claude is significantly less likely to hallucinate a vulnerability that doesn't exist or misattribute an attack technique. In security, a false positive has real cost — responders burn hours chasing ghosts.",
          "Claude's extended context window (200K tokens in Claude 3) means you can feed it an entire CloudTrail log for a 24-hour window in a single call. Competing models force you to chunk and lose cross-event correlation. Correlation is exactly where attackers hide — in the space between events.",
          "Anthropic's safety research also means Claude has strong guardrails against being weaponized through prompt injection in log data. If an attacker injects instructions into a log entry hoping to manipulate your AI triage system, Claude's training makes it significantly more resistant to acting on those injected instructions.",
        ],
      },
      {
        title: '6. How this changes the security landscape',
        body: [
          "The SOC analyst's job description is changing, not disappearing. The analysts who thrive are those who learn to write effective security prompts, design AI-in-the-loop workflows, and verify AI output critically rather than blindly. Prompt engineering is becoming a core security skill.",
          "The attack surface is also expanding. LLM-backed security pipelines introduce new threat models: prompt injection via log data, adversarial inputs designed to confuse AI triage, and model poisoning if fine-tuned models are used. Security teams are now responsible for securing the AI systems they deploy.",
          "The bar for entry-level attacks is dropping. Attackers with access to the same LLMs can automate reconnaissance, generate phishing at scale, and research vulnerabilities faster. The AWS/Anthropic collaboration is significant partly because it gives defenders access to the same acceleration.",
          "Teams that build the AI-augmented pipeline first will have an asymmetric advantage — not permanently, but long enough to matter. The window to build this infrastructure before it becomes table stakes is measured in months, not years.",
        ],
      },
      {
        title: 'Where this goes next',
        body: [
          "Amazon Bedrock Agents — multi-step autonomous agents that can call AWS APIs — are the next frontier. An agent that detects an anomalous IAM role assumption, queries CloudTrail to build a timeline, checks if the role has been used from that IP before, quarantines the credentials, and opens a Jira ticket is technically possible today with current primitives.",
          "Anthropic's roadmap points toward models with deeper tool use and more reliable instruction following. AWS's roadmap points toward tighter Bedrock integration with native security services. The convergence of those two trajectories is an AI security operations platform that doesn't exist yet but will within 18 months.",
          "The teams that understand the current primitives well enough to build with them are the teams that will define what that platform looks like.",
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
