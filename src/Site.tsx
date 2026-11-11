import { useCallback, useEffect, useRef, useState } from "react";
import { App } from "./App";
import { JocaIntro, shouldShowIntro } from "./JocaIntro";
export function Site() {
  const [intro, setIntro] = useState(shouldShowIntro);
  const returnTo = useRef<HTMLElement | null>(null);
  const pendingFocus = useRef(false);
  const finish = useCallback(() => {
    pendingFocus.current = true;
    setIntro(false);
  }, []);
  useEffect(() => {
    if (intro || !pendingFocus.current) return;
    const frame = window.requestAnimationFrame(() => {
      (returnTo.current ?? document.getElementById("conteudo"))?.focus({
        preventScroll: true,
      });
      pendingFocus.current = false;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [intro]);
  function replay(button: HTMLButtonElement) {
    returnTo.current = button;
    setIntro(true);
  }
  return (
    <>
      <App onReplayIntro={replay} />
      {intro && <JocaIntro onFinish={finish} />}
    </>
  );
}
