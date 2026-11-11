import { useEffect, useRef, useState } from "react";
import { galleryPhotos, galleryCollections } from "./gallery-content";
import "./photo-gallery.css";

export function PhotoGallery({
  collection,
}: {
  collection: "escola" | "2024" | "2025";
}) {
  const photos = galleryPhotos.filter(
    (photo) => photo.collection === collection && photo.authorized,
  );
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLButtonElement | null>(null);
  const close = useRef<HTMLButtonElement>(null);
  const open = active !== null;
  useEffect(() => {
    if (!open) return;
    const element = dialog.current!;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    close.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      origin.current?.focus({ preventScroll: true });
    };
  }, [open]);
  if (!photos.length) return null;
  const info = galleryCollections.find((item) => item.id === collection)!;
  const photo = active === null ? null : photos[active];
  const move = (step: number) =>
    setActive((current) =>
      current === null
        ? null
        : (current + step + photos.length) % photos.length,
    );
  return (
    <section className="photo-collection" aria-label={info.title}>
      <div className="photo-collection-heading">
        <p className="eyebrow">{info.label}</p>
        <h2>{info.title}</h2>
        <p className="photo-review-note">
          Fotografias da escola · uso de imagem autorizado pela direção.
        </p>
      </div>
      <div className="photo-grid">
        {photos.map((item, index) => (
          <figure key={item.id}>
            <button
              className="photo-open"
              aria-label={"Ampliar: " + item.caption}
              onClick={(event) => {
                origin.current = event.currentTarget;
                setActive(index);
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
              />
              <span className="photo-open-label" aria-hidden="true">
                Ver fotografia ↗
              </span>
            </button>
            <figcaption>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="photo-lightbox"
        aria-label="Fotografia ampliada"
        aria-describedby={photo ? collection + "-caption" : undefined}
        onCancel={(event) => {
          event.preventDefault();
          setActive(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActive(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
          if (event.key === "Tab") {
            const buttons = Array.from(
              dialog.current!.querySelectorAll<HTMLButtonElement>("button"),
            );
            const first = buttons[0],
              last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="lightbox-toolbar">
          <span>
            JOYCE HELENA · {active === null ? "" : active + 1} / {photos.length}
          </span>
          <button ref={close} onClick={() => setActive(null)}>
            Fechar <span aria-hidden="true">×</span>
          </button>
        </div>
        {photo && (
          <figure>
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
            />
            <figcaption id={collection + "-caption"} aria-live="polite">
              {photo.caption}
            </figcaption>
          </figure>
        )}
        <div className="lightbox-controls">
          <button onClick={() => move(-1)}>← Anterior</button>
          <span>Use as setas do teclado</span>
          <button onClick={() => move(1)}>Próxima →</button>
        </div>
      </dialog>
    </section>
  );
}
