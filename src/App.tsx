import { scheduleContactConfig, scheduleContactUrl } from "./schedule-contact";
import { ExternalLink } from "./HomeHighlights";
import { useState } from "react";
import { JocaChat } from "./joca/JocaChat";
import type { JocaRequest } from "./joca/JocaChat";
import { galleryPhotos } from "./gallery-content";
import { Hero, Trial, SeasonalEvent, Contacts } from "./HomeHighlights";
import { PhotoGallery } from "./PhotoGallery";
import { SchoolPresentation } from "./SchoolPresentation";
import {
  Header,
  SectionTitle,
  OptionalImage,
  PhotoSlot,
  links,
} from "./components";
import { content as c } from "./content";
export function App({
  onReplayIntro,
}: {
  onReplayIntro: (button: HTMLButtonElement) => void;
}) {
  const [chatRequest, setChatRequest] = useState<JocaRequest | null>(null);
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <div className="ribbon" aria-hidden="true">
          {c.ribbon.map((word, i) => (
            <span className="ribbon-item" key={word}>
              {i > 0 && <span>✧</span>}
              {word}
            </span>
          ))}
        </div>
        <section className="section modalities" id="modalidades">
          <SectionTitle label={c.modalities.label} title={c.modalities.title}>
            {c.modalities.intro}
          </SectionTitle>
          <div className="modality-grid">
            {c.modalities.items.map((item, i) => (
              <article className="modality" key={item.name}>
                <span className="modality-number" aria-hidden="true">
                  0{i + 1}
                </span>
                <div className="modality-symbol" aria-hidden="true">
                  {item.symbol}
                </div>
                <h3>{item.name}</h3>
                <p>{item.tagline}</p>
                <dl className="modality-details">
                  <div>
                    <dt>{c.modalities.ageLabel}</dt>
                    <dd>{item.ageRange ?? c.modalities.pending}</dd>
                  </div>
                  <div>
                    <dt>{c.modalities.descriptionLabel}</dt>
                    <dd>
                      {item.description ?? c.modalities.pendingDescription}
                    </dd>
                  </div>
                </dl>
                {scheduleContactConfig.destination === "joca" &&
                scheduleContactConfig.jocaEnabled ? (
                  <button
                    type="button"
                    className="schedule-contact action-primary"
                    onClick={(event) =>
                      setChatRequest({
                        trigger: event.currentTarget,
                        modality: item.name,
                      })
                    }
                  >
                    Consultar horários
                  </button>
                ) : (
                  <ExternalLink
                    className="schedule-contact action-primary"
                    href={scheduleContactUrl(item.name, "whatsapp")!}
                  >
                    Consultar horários
                  </ExternalLink>
                )}
              </article>
            ))}
          </div>
        </section>
        <Trial />
        <SchoolPresentation />
        <SeasonalEvent />
        <section className="performances" id="espetaculos">
          <div className="section">
            <div className="gallery-heading">
              <SectionTitle
                label={c.performances.label}
                title={c.performances.title}
              />
              <p>{c.performances.intro}</p>
            </div>
            {galleryPhotos.some(
              (photo) => photo.collection !== "escola" && photo.authorized,
            ) ? (
              <>
                <PhotoGallery collection="2024" />
                <PhotoGallery collection="2025" />
              </>
            ) : (
              <div
                className="performance-gallery"
                role="group"
                aria-label={c.performances.galleryLabel}
              >
                {c.performances.photos.map((photo) => (
                  <PhotoSlot key={photo.caption} photo={photo} />
                ))}
              </div>
            )}
            <p className="gallery-note">{c.performances.note}</p>
          </div>
        </section>
        <section className="section joca-section" id="joca">
          <div className="joca-picture">
            <OptionalImage
              src={c.joca.image}
              alt="Jóca, personagem oficial da escola, em ilustração de corpo inteiro"
            />
          </div>
          <div className="joca-copy">
            <div className="joca-intro">
              <OptionalImage
                src={c.joca.profile}
                alt="Retrato ilustrado da Jóca"
                className="joca-avatar"
              />
              <span className="eyebrow">{c.joca.eyebrow}</span>
            </div>
            <SectionTitle label={c.joca.label} title={c.joca.title} />
            <p>{c.joca.text}</p>
            <button
              type="button"
              className="intro-replay"
              onClick={(event) => onReplayIntro(event.currentTarget)}
            >
              {c.joca.replay} <span aria-hidden="true">↗</span>
            </button>
            <div className="joca-note">
              <span aria-hidden="true">✧</span>
              <p>{c.joca.notice}</p>
            </div>
          </div>
        </section>
        <Contacts />
      </main>
      <footer className="footer">
        <div className="footer-top">
          <a className="footer-brand" href="#inicio">
            {c.brand.name}
            <small>{c.brand.subtitle.toUpperCase()}</small>
          </a>
          <p>{c.footer.signature}</p>
          <a href="#inicio" className="back-top">
            {c.footer.back}
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            {c.brand.name} — {c.brand.subtitle}
          </span>
          <nav aria-label="Navegação do rodapé">
            {links.slice(0, 3).map(([id, label]) => (
              <a key={id} href={"#" + id}>
                {label}
              </a>
            ))}
          </nav>
        </div>
        <p className="developer-credit">
          {c.footer.developerLabel} <strong>{c.footer.developerName}</strong>
        </p>
      </footer>
      <JocaChat
        request={chatRequest}
        onOpen={setChatRequest}
        onClose={() => setChatRequest(null)}
      />
    </>
  );
}
