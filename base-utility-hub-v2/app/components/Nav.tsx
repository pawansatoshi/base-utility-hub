"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Network" },
  { href: "/wallet", label: "Wallet" },
  { href: "/explorer", label: "Explorer" },
  { href: "/gas", label: "Gas" },
  { href: "/tools", label: "Tools" },
  { href: "/faucets", label: "Faucets" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">B</div>
          <span className="nav-logo-text">Base Utility Hub</span>
          <span className="nav-logo-badge">v2</span>
        </Link>
        <div className="nav-links">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link${pathname === l.href ? " active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
