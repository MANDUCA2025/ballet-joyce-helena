import { useCallback, useEffect, useRef, useState } from "react";
import "./joca-intro.css";
export const INTRO_SESSION_KEY = "joyce-helena:intro-seen:v1";
export const INTRO_PRESENTED_KEY = "joyce-helena:intro-presented:v1";
export function shouldShowIntro() {
  try {
    return (
      window.sessionStorage.getItem(INTRO_SESSION_KEY) !== "1" &&
      window.sessionStorage.getItem(INTRO_PRESENTED_KEY) !== "1"
    );
  } catch {
    return true;
  }
}
function markSession(key: string) {
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {
    /* Storage restrictions never block entry. */
  }
}
export function JocaIntro({ onFinish }: { onFinish: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const finished = useRef(false);
  const exitTimer = useRef<number | undefined>(undefined);
  const [leaving, setLeaving] = useState(false);
  const [sound, setSound] = useState(false);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [manual, setManual] = useState(reduced);
  const finish = useCallback(
    (completed = true) => {
      if (finished.current) return;
      finished.current = true;
      video.current?.pause();
      if (completed) markSession(INTRO_SESSION_KEY);
      setLeaving(true);
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      exitTimer.current = window.setTimeout(onFinish, reduced ? 0 : 240);
    },
    [onFinish],
  );
  useEffect(() => {
    const modal = dialog.current,
      player = video.current;
    if (!modal || !player) return;
    finished.current = false;
    modal.showModal();
    // Presentation and completion are distinct: reload must not restart an unfinished visit.
    markSession(INTRO_PRESENTED_KEY);
    skip.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let disposed = false;
    player.muted = true;
    if (!reduced)
      void player.play().catch(() => {
        if (!disposed) setManual(true);
      });
    return () => {
      disposed = true;
      window.clearTimeout(exitTimer.current);
      player.pause();
      modal.close();
      document.body.style.overflow = overflow;
    };
  }, [finish, reduced]);
  async function toggleSound() {
    const player = video.current;
    if (!player) return;
    player.muted = !player.muted;
    try {
      await player.play();
      setSound(!player.muted);
    } catch {
      player.muted = true;
      setSound(false);
      setManual(true);
    }
  }
  return (
    <dialog
      ref={dialog}
      className={"joca-opening" + (leaving ? " is-leaving" : "")}
      aria-labelledby="intro-title"
      aria-describedby="intro-description"
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        const buttons = Array.from(
          e.currentTarget.querySelectorAll<HTMLButtonElement>(
            "button:not(:disabled)",
          ),
        );
        const index = buttons.indexOf(
          document.activeElement as HTMLButtonElement,
        );
        e.preventDefault();
        buttons[
          (index + (e.shiftKey ? buttons.length - 1 : 1)) % buttons.length
        ]?.focus();
      }}
      onCancel={(e) => {
        e.preventDefault();
        finish();
      }}
    >
      <div className="opening-shell">
        <div className="opening-heading">
          <p className="eyebrow">JOYCE HELENA · ESCOLA DE BALLET</p>
          <h2 id="intro-title">Um primeiro encontro com a Jóca.</h2>
          <p id="intro-description">
            Uma breve mensagem de boas-vindas. Você pode entrar no site a
            qualquer momento.
          </p>
        </div>
        <div className="opening-screen">
          <video
            ref={video}
            src="/videos/joca-apresentacao-web.mp4"
            poster="/videos/joca-apresentacao-poster.webp"
            muted
            autoPlay={!reduced && !manual}
            playsInline
            preload={reduced ? "metadata" : "auto"}
            width="1280"
            height="720"
            aria-label="Apresentação oficial de boas-vindas da Jóca"
            onPlaying={() => setManual(false)}
            onEnded={() => finish()}
            onError={() => finish(false)}
            onVolumeChange={() => setSound(!(video.current?.muted ?? true))}
          />
        </div>
        <div className="opening-controls">
          <button
            type="button"
            onClick={() => {
              if (manual)
                void video.current?.play().catch(() => setManual(true));
              else void toggleSound();
            }}
            aria-pressed={sound}
            aria-label={manual ? "Iniciar apresentação" : undefined}
          >
            {manual ? "Iniciar vídeo" : sound ? "Desativar som" : "Ativar som"}
          </button>
          <p role="status">
            {manual
              ? "Inicie o vídeo ou entre no site."
              : "Apresentação de até 10 segundos"}
          </p>
          <button
            ref={skip}
            type="button"
            className="opening-skip"
            onClick={() => finish()}
          >
            Pular apresentação <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}
