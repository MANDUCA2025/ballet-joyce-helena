import "./brand-schedules.css";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { content } from "./content";
import type { AuthorizedPhoto } from "./content";
export const links = content.navigation;
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="header-inner">
        <a
          className="identity"
          href="#inicio"
          aria-label="Joyce Helena — início"
        >
          <img
            src={content.brand.logo}
            width="88"
            height="88"
            alt="Logo Joyce Helena — Escola de Ballet"
          />
          <span>
            {content.brand.name}
            <small>{content.brand.subtitle.toUpperCase()}</small>
          </span>
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Fechar menu" : "Abrir menu"}{" "}
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
        <nav
          id="main-navigation"
          className={open ? "navigation is-open" : "navigation"}
          aria-label="Navegação principal"
        >
          {links.map(([id, label]) => (
            <a key={id} href={"#" + id} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
export function SectionTitle({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-title">
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      {children && <p className="section-copy">{children}</p>}
    </div>
  );
}
export function Unavailable({
  children,
  description,
}: {
  children: ReactNode;
  description: string;
}) {
  return (
    <div className="unavailable">
      <button type="button" disabled>
        {children}
        <span aria-hidden="true"> ↗</span>
      </button>
      <p>{description}</p>
    </div>
  );
}
export function OptionalImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [missing, setMissing] = useState(false);
  return missing ? (
    <div
      className={"image-fallback " + (className ?? "")}
      role="img"
      aria-label={alt + " — imagem indisponível"}
    >
      <span aria-hidden="true">✧</span>
      <p>
        Imagem oficial da Jóca
        <br />
        aguardando disponibilização.
      </p>
    </div>
  ) : (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => setMissing(true)}
      loading="lazy"
    />
  );
}

export function PhotoSlot({ photo }: { photo: AuthorizedPhoto }) {
  const [failed, setFailed] = useState(false);
  const available = photo.authorized && photo.src && photo.alt.trim();
  return (
    <figure className="official-photo">
      {available && !failed ? (
        <img
          src={photo.src!}
          alt={photo.alt}
          loading="eager"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="official-photo-empty">
          <span aria-hidden="true">✧</span>
          <p>{failed ? content.photos.unavailable : content.photos.pending}</p>
        </div>
      )}
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}
