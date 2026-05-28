import { SocialLink } from "@/types";
import styles from "./SocialLinksSection.module.css";
import {
  AtSign,
  Camera,
  Disc3,
  Globe,
  Mail,
  MessageCircle,
  Music2,
  Phone,
  Send,
  Link as LinkIcon,
} from "lucide-react";

// Custom SVG Icons for Brands
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon
      points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
      fill="var(--bg-primary)"
    ></polygon>
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.6 5.82a5.45 5.45 0 0 0 3.4 1.16v3.54a8.92 8.92 0 0 1-3.4-.7v5.7A6.48 6.48 0 1 1 10.12 9.04c.36 0 .72.03 1.06.09v3.62a2.93 2.93 0 1 0 1.98 2.77V2h3.44v3.82z" />
  </svg>
);

const SnapchatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.2c3.06 0 5.18 2.13 5.18 5.21 0 .82-.08 1.62-.07 2.39.02.42.32.67.75.67.31 0 .62-.11.93-.25.25-.12.51.01.59.27.08.25-.03.52-.27.64-.54.27-1.12.47-1.72.56.17.53.77 1.72 2.58 2.42.31.12.5.42.45.75-.05.32-.33.56-.66.58-.58.03-1.07.15-1.46.36-.29.16-.45.39-.62.64-.27.39-.57.83-1.27.83-.38 0-.84-.13-1.42-.29-.72-.21-1.62-.46-2.99-.46s-2.27.25-2.99.46c-.58.16-1.04.29-1.42.29-.7 0-1-.44-1.27-.83-.17-.25-.33-.48-.62-.64-.39-.21-.88-.33-1.46-.36-.33-.02-.61-.26-.66-.58-.05-.33.14-.63.45-.75 1.81-.7 2.41-1.89 2.58-2.42-.6-.09-1.18-.29-1.72-.56a.48.48 0 0 1-.27-.64c.08-.26.34-.39.59-.27.31.14.62.25.93.25.43 0 .73-.25.75-.67.01-.77-.07-1.57-.07-2.39C6.82 4.33 8.94 2.2 12 2.2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm6.5 0h3.8v1.65h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95V21h-4V9z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.02c-3.23.7-3.91-1.39-3.91-1.39-.53-1.35-1.29-1.71-1.29-1.71-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.58-.29-5.29-1.29-5.29-5.73 0-1.27.45-2.3 1.19-3.11-.12-.29-.52-1.48.11-3.07 0 0 .98-.31 3.18 1.19a10.98 10.98 0 0 1 5.82 0c2.2-1.5 3.17-1.19 3.17-1.19.64 1.59.24 2.78.12 3.07.74.81 1.19 1.84 1.19 3.11 0 4.45-2.72 5.43-5.3 5.72.42.36.79 1.07.79 2.16v3.06c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
  </svg>
);

const TwitchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 3h17v11.5L16.5 19H13l-2.5 2.5H8V19H4V3zm2 2v12h4v2l2-2h4l3-3V5H6zm9 3h2v5h-2V8zm-5 0h2v5h-2V8z" />
  </svg>
);

const normalizePlatform = (platform: string) =>
  platform
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

const getIcon = (platform: string) => {
  switch (normalizePlatform(platform)) {
    case "facebook":
    case "fb":
      return <FacebookIcon />;
    case "youtube":
    case "yt":
      return <YoutubeIcon />;
    case "instagram":
    case "insta":
      return <InstagramIcon />;
    case "tiktok":
      return <TikTokIcon />;
    case "x":
    case "twitter":
      return <TwitterIcon />;
    case "whatsapp":
    case "wa":
      return <MessageCircle />;
    case "telegram":
      return <Send />;
    case "linkedin":
      return <LinkedInIcon />;
    case "github":
      return <GitHubIcon />;
    case "snapchat":
      return <SnapchatIcon />;
    case "threads":
      return <AtSign />;
    case "discord":
      return <MessageCircle />;
    case "twitch":
      return <TwitchIcon />;
    case "spotify":
      return <Disc3 />;
    case "soundcloud":
      return <Music2 />;
    case "behance":
    case "portfolio":
      return <Camera />;
    case "website":
    case "site":
      return <Globe />;
    case "email":
    case "mail":
      return <Mail />;
    case "phone":
    case "mobile":
      return <Phone />;
    default:
      return <LinkIcon />;
  }
};

const getColors = (platform: string) => {
  switch (normalizePlatform(platform)) {
    case "facebook":
    case "fb":
      return { bg: "#1877F2", text: "#fff" };
    case "youtube":
    case "yt":
      return { bg: "#FF0000", text: "#fff" };
    case "instagram":
    case "insta":
      return {
        bg: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        text: "#fff",
      };
    case "tiktok":
      return { bg: "#111111", text: "#fff" };
    case "whatsapp":
    case "wa":
      return { bg: "#25D366", text: "#fff" };
    case "telegram":
      return { bg: "#0088cc", text: "#fff" };
    case "x":
    case "twitter":
      return { bg: "#000000", text: "#fff" };
    case "linkedin":
      return { bg: "#0A66C2", text: "#fff" };
    case "github":
      return { bg: "#24292F", text: "#fff" };
    case "snapchat":
      return { bg: "#FFFC00", text: "#111" };
    case "threads":
      return { bg: "#101010", text: "#fff" };
    case "discord":
      return { bg: "#5865F2", text: "#fff" };
    case "twitch":
      return { bg: "#9146FF", text: "#fff" };
    case "spotify":
      return { bg: "#1DB954", text: "#fff" };
    case "soundcloud":
      return { bg: "#FF5500", text: "#fff" };
    case "behance":
      return { bg: "#1769FF", text: "#fff" };
    case "portfolio":
    case "website":
    case "site":
      return { bg: "#334155", text: "#fff" };
    case "email":
    case "mail":
      return { bg: "#EA4335", text: "#fff" };
    case "phone":
    case "mobile":
      return { bg: "#16A34A", text: "#fff" };
    default:
      return { bg: "var(--accent)", text: "#fff" };
  }
};

export default function SocialLinksSection({ links }: { links: SocialLink[] }) {
  const visibleLinks = links
    .filter((l) => l.is_visible)
    .sort((a, b) => a.display_order - b.display_order);

  if (visibleLinks.length === 0)
    return (
      <section className={styles.section} id="social">
        <div className={styles.container}>
          <h2 className={styles.title}>روابط التواصل</h2>
          <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>
            لم يتم إضافة روابط تواصل بعد. (يمكنك إضافتها من لوحة التحكم)
          </p>
        </div>
      </section>
    );

  return (
    <section className={styles.section} id="social">
      <div className={styles.container}>
        <h2 className={styles.title}>روابط التواصل</h2>
        <div className={styles.linksGrid}>
          {visibleLinks.map((link) => {
            const colors = getColors(link.platform);
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={styles.iconLink}
                style={{ background: colors.bg, color: colors.text }}
                title={link.platform}
              >
                <div className={styles.iconWrapper}>
                  {getIcon(link.platform)}
                </div>
                <div
                  className={styles.glow}
                  style={{ background: colors.bg }}
                ></div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
