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
];
