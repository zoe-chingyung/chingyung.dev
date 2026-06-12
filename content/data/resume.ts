/**
 * Structured resume data — the Resume page renders entirely from this file.
 * Edit here, never in the page component.
 */
export const profile = {
  name: "Ching Yung",
  title: "AWS Cloud & Security Engineer",
  location: "London, United Kingdom",
  summary:
    "AWS Cloud & Security Engineer with 5+ years building and operating production infrastructure using Terraform, CloudFormation, and CI/CD automation. Hands-on across the AWS service catalogue — compute, storage, databases, serverless (Lambda), networking, and security — with a track record of deploying reusable IaC modules at scale and embedding compliance into every pipeline. Dual AWS Professional certifications (Solutions Architect + DevOps Engineer) and a CKA. Experienced building production observability with CloudWatch, Datadog, and Prometheus, and maintaining operational runbooks and incident response processes that keep services reliable.",
  links: {
    github: "https://github.com/zoe-chingyung",
    linkedin: "https://linkedin.com/in/thezoeyung",
    email: ["yungchingzoe", "gmail.com"] // 依照你的元件邏輯，分開組裝以防止網絡爬蟲
  },
  phone: "+44 07826083928",
  pdfPath: "/resume.pdf"
};

export interface ExperienceEntry {
  company: string;
  role: string;
  start: string; // 格式: "YYYY-MM" 或 "YYYY"
  end?: string; // 如果未定義 (undefined) 代表現職 (Present)
  context?: string; // 補充公司或專案的背景資訊
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: "Evri",
    role: "AWS Security Engineer",
    start: "2026-05", // 2026年5月入職
    context: "The UK's largest dedicated parcel delivery network — securing a massive multi-account AWS estate and automated logistics platforms",
    highlights: [
      "Assumed ownership of the AWS cloud security posture management (CSPM), proactively monitoring alerts across GuardDuty, Security Hub, and CloudTrail to maintain the platform's security baseline.",
      "Contributed to the governance of multi-account Landing Zone environments by reviewing identity perms (IAM, least privilege) and refining Service Control Policies (SCPs) to enforce guardrails.",
      "Integrated with the cross-functional platform infrastructure team to ensure secure-by-default practices are embedded into deployment pipelines and infrastructure-as-code (Terraform) modules."
    ]
  },
  {
    company: "Self-directed",
    role: "Career Development & Upskilling",
    start: "2025",
    highlights: [
      "Earned CKA certification — deepened Linux systems and Kubernetes operations knowledge across namespaces, network policies, and node-level troubleshooting.",
      "Open-sourced a serverless AWS platform on GitHub — API Gateway + Lambda backbone with CloudFormation IaC, automated deployment pipelines, and security defaults baked into reusable templates.",
      "Bridged theoretical expertise from AWS Professional certifications with hands-on labs to build data pipelines using MSK, EMR (Spark), and Apache Iceberg, aligning with Common Data Fabric (CDF) architectural patterns."
    ]
  },
  {
    company: "Toluna Corporate",
    role: "Senior Cloud Engineer",
    start: "2022",
    end: "2024",
    context: "Mission-critical SaaS platform — millions of users globally, real-time analytics workloads",
    highlights: [
      "Deployed reusable Terraform modules for all core AWS components — VPC, EKS, IAM, KMS, RDS, S3, DynamoDB — across 200+ resources, cutting deployment lead time from 120 → 15 min.",
      "Implemented CI/CD pipelines (GitLab CI, Jenkins) with automated rollbacks, compliance checks, and deployment safety gates across multiple environments.",
      "Supported security practices — IAM permission boundaries, AWS Inspector automation, infrastructure code scanning (tfsec/Checkov) — ensuring compliance and eliminating critical vulnerabilities.",
      "Built production observability using CloudWatch metrics/logs/alarms, Datadog APM with distributed tracing, and SLI/SLO dashboards that caught regressions before customer impact.",
      "Maintained operational runbooks and incident triage workflows — led blameless post-mortems and cross-team resolution, holding 99.99% uptime."
    ]
  },
  {
    company: "Further",
    role: "Software Engineer",
    start: "2021",
    end: "2022",
    context: "Research SaaS platform — greenfield AWS migration, serverless-first architecture",
    highlights: [
      "Led the greenfield AWS platform design, delivering a resilient multi-layer architecture handling 700K+ daily requests with sub-second latency.",
      "Architected serverless workloads using Lambda, API Gateway, and event-driven patterns with CloudFront caching, reducing database load by 65%.",
      "Established deployment governance with canary rollouts, automated rollback, and compliance gates coordinated across platform and product teams.",
      "Centralised secrets management via AWS Secrets Manager with automated rotation, eliminating hardcoded credentials across 15+ services.",
      "Built internal automation tooling in Python and Go for infrastructure provisioning, monitoring integration, and operational runbooks."
    ]
  },
  {
    company: "ESD Services Limited",
    role: "Software Engineer",
    start: "2019",
    end: "2021",
    context: "High-volume e-commerce platform — 700K+ daily transactions, global distribution",
    highlights: [
      "Managed production AWS infrastructure (EC2, RDS, ElastiCache, S3, CloudFront) with auto-scaling and disaster recovery for peak traffic events.",
      "Introduced Docker containerisation with CI/CD automation, improving deployment reliability and environment consistency across global regions.",
      "Wrote automation scripts in Python and Bash for infrastructure provisioning, CloudWatch monitoring integration, and operational runbooks."
    ]
  }
];

export const keyImpact = [
  {
    title: "99.99% Availability",
    description: "Production incident ownership with SLI/SLO monitoring and automated failover."
  },
  {
    title: "8× Faster Deployments",
    description: "120 → 15 min via reusable Terraform modules and CI/CD pipelines with compliance gates."
  },
  {
    title: "Zero Critical Findings",
    description: "GuardDuty + Security Hub + CloudTrail + IaC scanning enforced across 200+ resources."
  },
  {
    title: "200+ IaC Resources",
    description: "Reusable Terraform modules across compute, storage, database, and networking."
  }
];

export const skills: { category: string; items: string[] }[] = [
  {
    category: "AWS Services",
    items: ["EC2 / VPC", "Lambda", "API Gateway", "EKS / ECS", "S3", "DynamoDB", "RDS / Aurora", "CloudFront", "IAM / SCP"]
  },
  {
    category: "Infrastructure as Code",
    items: ["Terraform", "CloudFormation", "Reusable Modules", "Kubernetes / Helm", "Docker"]
  },
  {
    category: "CI/CD & Deployment",
    items: ["GitLab CI", "Jenkins", "GitHub Actions", "Automated Rollbacks", "Compliance Gates"]
  },
  {
    category: "AWS Security & Governance",
    items: ["GuardDuty", "Security Hub", "CloudTrail", "AWS Config", "KMS", "Secrets Manager", "tfsec / Checkov", "Policy-as-Code"]
  },
  {
    category: "Observability",
    items: ["CloudWatch", "Datadog APM", "Prometheus / Grafana", "Distributed Tracing", "SLI / SLO"]
  },
  {
    category: "Networking",
    items: ["VPC / Subnets", "NAT / Routing", "Endpoint Policies", "Security Groups"]
  },
  {
    category: "Languages & Scripting",
    items: ["Python", "Bash / Linux", "AWS CLI", "Go", "Node.js"]
  },
  {
    category: "Operations",
    items: ["Runbooks / Playbooks", "Incident Response", "RCA / Post-Mortems", "DR & Failover", "Change Management"]
  }
];

export const certifications = [
];

export const education = [
  {
    degree: "BEng Computer Science & Engineering",
    school: "Hong Kong University of Science and Technology"
  }
];
