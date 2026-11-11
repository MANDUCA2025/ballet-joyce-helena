import type { ReactNode } from "react";
import { content as c } from "./content";
import "./home-highlights.css";
export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}
export function Hero() {
  const photo = c.hero.photo;
  return (
    <section className="home-hero" id="inicio">
      <div className="home-hero-copy">
        <p className="eyebrow">{c.hero.eyebrow}</p>
        <h1>
          {c.hero.firstLine} {c.hero.secondLine} <em>{c.hero.accent}</em>
        </h1>
        <p className="hero-lead">{c.hero.description}</p>
        <div className="home-actions">
          <ExternalLink
            className="action-primary"
            href={c.contact.whatsapp.url}
          >
            {c.hero.cta} ↗
          </ExternalLink>
          <a className="action-text" href="#modalidades">
            {c.hero.link} ↓
          </a>
        </div>
        <p className="hero-flourish">Dançar. Descobrir. Florescer.</p>
      </div>
      <figure className="home-hero-photo">
        {photo.authorized ? (
          <>
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              fetchPriority="high"
            />
            <figcaption>Cada conquista merece ser celebrada.</figcaption>
          </>
        ) : (
          <div className="hero-photo-pending">
            <span aria-hidden="true">✧</span>
            <p>
              Um universo de possibilidades.
              <br />
              Uma história em cada passo.
            </p>
            <small>
              Fotografia de aula aguardando liberação para publicação.
            </small>
          </div>
        )}
      </figure>
    </section>
  );
}
export function Trial() {
  return (
    <section className="trial-section">
      <div>
        <p className="eyebrow">VENHA DANÇAR COM A GENTE</p>
        <h2>{c.trial.title}</h2>
        <p>{c.trial.text}</p>
      </div>
      <div className="trial-action">
        <ExternalLink className="action-primary" href={c.contact.whatsapp.url}>
          {c.trial.cta} ↗
        </ExternalLink>
        <small>{c.trial.note}</small>
      </div>
    </section>
  );
}
export function SeasonalEvent() {
  return (
    <section
      className="seasonal-section section"
      id="quatro-estacoes"
      aria-labelledby="seasonal-title"
    >
      <figure>
        <img
          src={c.event.poster}
          width="642"
          height="865"
          alt="Cartaz oficial Quatro Estações, tema do espetáculo de final de ano 2026 da Escola Joyce Helena"
        />
        <figcaption>Cartaz oficial · Escola Joyce Helena</figcaption>
      </figure>
      <div className="seasonal-copy">
        <p className="eyebrow">A DANÇA EM TODAS AS ESTAÇÕES</p>
        <h2 id="seasonal-title">{c.event.title}</h2>
        <span className="seasonal-rule" aria-hidden="true">
          ✧
        </span>
        <p>{c.event.text}</p>
        <p className="event-pending">{c.event.note}</p>
        <a className="action-text" href="#espetaculos">
          Reviva nossas apresentações ↓
        </a>
      </div>
    </section>
  );
}
export function Contacts() {
  return (
    <section className="contact" id="contato">
      <div className="section">
        <p className="eyebrow">{c.contact.label}</p>
        <h2>{c.contact.title}</h2>
        <p>{c.contact.intro}</p>
        <div className="contact-grid">
          <div className="contact-card">
            <h3>WhatsApp</h3>
            <ExternalLink href={c.contact.whatsapp.url}>
              Principal · {c.contact.whatsapp.number} ↗
            </ExternalLink>
            <ExternalLink href={c.contact.alternative.url}>
              Alternativo · {c.contact.alternative.number} ↗
            </ExternalLink>
          </div>
          <div className="contact-card">
            <h3>Instagram</h3>
            <ExternalLink href={c.contact.instagram.url}>
              {c.contact.instagram.profile} ↗
            </ExternalLink>
          </div>
          <div className="contact-card">
            <h3>{c.contact.location.title}</h3>
            <p>{c.contact.location.name}</p>
            <p>{c.contact.location.address}</p>
            <ExternalLink href={c.contact.location.mapUrl}>
              Como chegar ↗
            </ExternalLink>
          </div>
        </div>
      </div>
    </section>
  );
}
