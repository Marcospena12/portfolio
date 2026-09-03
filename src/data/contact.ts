export type ContactLink = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

export const contactLinks: ContactLink[] = [
  {
    id: "email",
    label: "seuemail@exemplo.com",
    href: "mailto:seuemail@exemplo.com",
    icon: "FaEnvelope",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/Marcospena12",
    icon: "SiGithub",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/in/seu-usuario",
    icon: "FaLinkedin",
  },
];

