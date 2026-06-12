/**
 * Structured resume data — the Resume page renders entirely from this file.
 * Edit here, never in the page component. Replace all placeholder entries.
 */
export const profile = {
  name: "Ching Yung",
  title: "Cloud · Platform · Security Engineer",
  location: "London, United Kingdom",
  summary:
    "Building secure, scalable and automated cloud platforms through Infrastructure as Code, platform engineering and security engineering.",
  links: {
    github: "https://github.com/chingyung",
    linkedin: "https://www.linkedin.com/in/chingyung",
    email: ["hello", "chingyung.dev"], // assembled client-side to deter scrapers
  },
  /** Drop your PDF at public/resume.pdf (or wire your existing PDF pipeline). */
  pdfPath: "/resume.pdf",
};

export interface ExperienceEntry {
  company: string;
  role: string;
  start: string; // "2023-04"
  end?: string; // undefined = present
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: "Example Company Ltd",
    role: "Platform Engineer",
    start: "2023-01",
    highlights: [
      "Replace with real achievements — lead with outcomes and numbers.",
      "Designed AWS security posture management and remediation workflows.",
      "Built Terraform module library adopted across N teams.",
    ],
  },
  {
    company: "Previous Company",
    role: "DevOps Engineer",
    start: "2020-06",
    end: "2022-12",
    highlights: [
      "Replace with real achievements.",
      "Migrated legacy workloads to IaC-managed AWS infrastructure.",
    ],
  },
];

export const skills: { category: string; items: string[] }[] = [
  { category: "AWS", items: ["IAM", "Security Hub", "Organizations", "S3", "CloudFront", "Lambda", "EventBridge"] },
  { category: "Cloud Platforms", items: ["AWS", "Replace with others"] },
  { category: "Infrastructure as Code", items: ["Terraform", "CloudFormation"] },
  { category: "Platform Engineering", items: ["Golden paths", "Internal tooling", "Developer experience"] },
  { category: "Security Engineering", items: ["Posture management", "Remediation automation", "Compliance visibility"] },
  { category: "CI/CD", items: ["GitHub Actions", "OIDC federation", "Pipeline design"] },
  { category: "Observability", items: ["CloudWatch", "Replace with others"] },
  { category: "Programming", items: ["Python", "TypeScript", "Bash"] },
];
