import { useCallback, useEffect, useRef, useState } from "react";
import "./joca-intro.css";
export const INTRO_SESSION_KEY = "joyce-helena:intro-seen:v1";
export function shouldShowIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) !== "1";
  } catch {
    return true;
  }
}
function markSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
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
  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    video.current?.pause();
    markSeen();
    setLeaving(true);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    exitTimer.current = window.setTimeout(onFinish, reduced ? 0 : 240);
  }, [onFinish]);
  useEffect(() => {
    const modal = dialog.current,
      player = video.current;
    if (!modal || !player) return;
    finished.current = false;
    markSeen();
    modal.showModal();
    skip.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timeout = window.setTimeout(finish, 10000);
    const loadTimeout = window.setTimeout(() => {
      if (player.readyState < 2) finish();
    }, 4000);
    let disposed = false;
    player.muted = true;
    void player.play().catch(() => {
      if (!disposed) finish();
    });
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      window.clearTimeout(loadTimeout);
      window.clearTimeout(exitTimer.current);
      player.pause();
      modal.close();
      document.body.style.overflow = overflow;
    };
  }, [finish]);
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
      finish();
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
          e.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
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
            src="/videos/joca-apresentacao.mp4"
            muted
            autoPlay
            playsInline
            preload="auto"
            width="1920"
            height="1080"
            aria-label="Apresentação oficial de boas-vindas da Jóca"
            onEnded={finish}
            onError={finish}
            onVolumeChange={() => setSound(!(video.current?.muted ?? true))}
          />
        </div>
        <div className="opening-controls">
          <button
            type="button"
            onClick={() => void toggleSound()}
            aria-pressed={sound}
          >
            {sound ? "Desativar som" : "Ativar som"}
          </button>
          <p>Apresentação de até 10 segundos</p>
          <button
            ref={skip}
            type="button"
            className="opening-skip"
            onClick={finish}
          >
            Pular apresentação <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}
