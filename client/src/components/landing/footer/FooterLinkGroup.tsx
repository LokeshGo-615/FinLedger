import { ArrowUpRight } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterLinkGroupProps {
  title: string;
  links: FooterLink[];
}

export function FooterLinkGroup({
  title,
  links,
}: FooterLinkGroupProps) {
  return (
    <div>

      <h3 className="text-sm font-semibold text-[#f5f8f2]">
        {title}
      </h3>

      <ul className="mt-5 space-y-4">

        {links.map((link) => (
          <li key={link.label}>

            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={
                link.external
                  ? "noopener noreferrer"
                  : undefined
              }
              className="group inline-flex items-center gap-1 text-sm text-[#a3b6a0] transition-colors duration-200 hover:text-[#9ef494]"
            >

              {link.label}

              {link.external && (
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                />
              )}

            </a>

          </li>
        ))}

      </ul>

    </div>
  );
}