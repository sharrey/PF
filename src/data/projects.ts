export interface Project {
  name: string;
  desc: string;
  lang: string;
  langColor: string;
  tags: string[];
  log: { hash: string; msg: string }[];
  url?: string;
}

export const projects: Project[] = [
  {
    name: 'k8s-homelab',
    desc: 'Production-grade Kubernetes cluster on bare metal. Ingress, cert-manager, ArgoCD, monitoring stack — all IaC.',
    lang: 'HCL',
    langColor: '#7b42bc',
    tags: ['Kubernetes', 'Terraform', 'ArgoCD'],
    log: [
      { hash: 'a3f91c2', msg: 'fix: stop etcd from eating all the RAM again' },
      { hash: 'b7e204d', msg: 'feat: add Loki stack for log aggregation' },
      { hash: 'c1d83aa', msg: 'chore: cert-manager finally not crying' },
      { hash: '9fe0b61', msg: 'init: day 1, break everything, learn everything' },
    ],
  },
  {
    name: 'ci-templates',
    desc: 'Reusable GitHub Actions workflow templates for Docker build, K8s deploy, Terraform plan/apply, and security scanning.',
    lang: 'YAML',
    langColor: '#cb171e',
    tags: ['GitHub Actions', 'Docker', 'SAST'],
    log: [
      { hash: 'f2a77b3', msg: 'feat: add trivy container scanning step' },
      { hash: '3c9e10f', msg: 'fix: stop using :latest in prod. again.' },
      { hash: 'e84d22c', msg: 'feat: matrix strategy for multi-arch builds' },
      { hash: '701fa9b', msg: 'init: because copy-pasting workflows is tech debt' },
    ],
  },
  {
    name: 'infra-bootstrap',
    desc: 'Zero-to-prod AWS environment in one apply. VPC, EKS, RDS, S3 remote state, IAM least-privilege — opinionated and battle-tested.',
    lang: 'HCL',
    langColor: '#7b42bc',
    tags: ['Terraform', 'AWS', 'EKS'],
    log: [
      { hash: 'd91c4e7', msg: 'feat: add VPC flow logs to S3 for compliance' },
      { hash: '52b3081', msg: 'fix: IAM role trust policy was too permissive' },
      { hash: 'aa7f339', msg: 'feat: EKS managed node groups with spot support' },
      { hash: '8d02c5f', msg: 'init: terraform init && pray' },
    ],
  },
  {
    name: 'log-drain',
    desc: 'Lightweight Bash + Python pipeline that tails container logs, parses structured JSON, and ships to any endpoint. No Fluentd required.',
    lang: 'Python',
    langColor: '#3572A5',
    tags: ['Python', 'Bash', 'Observability'],
    log: [
      { hash: '6c1b8d4', msg: 'perf: 3× throughput with async batching' },
      { hash: 'e43a902', msg: 'fix: handle malformed JSON without dying' },
      { hash: '2f77d1c', msg: 'feat: add dead-letter queue for failed ships' },
      { hash: 'b90e551', msg: 'init: grep -f is not a log pipeline' },
    ],
  },
  {
    name: 'erp-platform',
    desc: 'Full-stack ERP system covering inventory, procurement, HR, and finance modules. Built for a mid-size business — replaced spreadsheet chaos with a real system.',
    lang: 'TypeScript',
    langColor: '#3178C6',
    tags: ['Node.js', 'React', 'PostgreSQL', 'REST API'],
    log: [
      { hash: 'a1f30e9', msg: 'feat: multi-tenant role-based access control' },
      { hash: 'c84b712', msg: 'feat: real-time inventory sync across warehouses' },
      { hash: '3e2d901', msg: 'fix: payroll calculation off by one pay period' },
      { hash: 'f770c4a', msg: 'init: excel is not an ERP' },
    ],
  },
  {
    name: 'img-gen-model',
    desc: 'Fine-tuned Stable Diffusion pipeline with custom LoRA adapters. REST API wrapper, async job queue, and S3 output storage — production-ready image generation.',
    lang: 'Python',
    langColor: '#3572A5',
    tags: ['Python', 'PyTorch', 'Diffusers', 'FastAPI'],
    log: [
      { hash: 'd39f110', msg: 'feat: LoRA fine-tuning on custom dataset' },
      { hash: '87c2a44', msg: 'perf: SDXL inference 2× faster with xformers' },
      { hash: '5b0e933', msg: 'feat: async job queue with Redis + Celery' },
      { hash: 'e12d007', msg: 'init: why pay $0.04/img when you can self-host' },
    ],
  },
  {
    name: 'workflow-optimizer',
    desc: 'Audited and re-architected CI/CD and deployment workflows — cut average pipeline time by 60% and eliminated manual handoff steps across 3 teams.',
    lang: 'YAML',
    langColor: '#cb171e',
    tags: ['GitHub Actions', 'Docker', 'Bash', 'Automation'],
    log: [
      { hash: '9ac571b', msg: 'perf: parallel test matrix cut CI from 18m → 7m' },
      { hash: '4df832e', msg: 'feat: auto-rollback on failed health check' },
      { hash: 'bb1c209', msg: 'chore: remove 400 lines of dead pipeline yaml' },
      { hash: '2a0f681', msg: 'init: "just click the button" is not a deploy process' },
    ],
  },
  {
    name: 'infra-cost-reduction',
    desc: 'Cloud cost audit and rightsizing project — identified over-provisioned EC2/RDS instances, moved workloads to spot, and implemented auto-scaling. Cut monthly AWS bill by ~40%.',
    lang: 'HCL',
    langColor: '#7b42bc',
    tags: ['Terraform', 'AWS', 'Cost Optimization'],
    log: [
      { hash: 'f55a319', msg: 'feat: spot instance pools for non-critical workloads' },
      { hash: '7e1c048', msg: 'fix: dev env running 24/7 for no reason — scheduled shutdown' },
      { hash: 'c203bb4', msg: 'perf: RDS rightsized from db.r5.2xl → db.r5.large' },
      { hash: 'd801fe2', msg: 'init: $12k/month AWS bill is a cry for help' },
    ],
  },
];
