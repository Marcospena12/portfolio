export type ContactLink = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

export const contactLinks: ContactLink[] = [
  {
    id: "email",
    label: "marcos_pena12@outlook.com",
    href: "mailto:marcos_pena12@outlook.com",
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
    href: "https://www.linkedin.com/in/marcos-vin%C3%ADcius-costa-pena-342327317/",
    icon: "FaLinkedin",
  },
];

