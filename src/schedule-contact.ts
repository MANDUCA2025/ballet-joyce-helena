export type ScheduleDestination = "whatsapp" | "joca";
export const scheduleContactConfig: {
  destination: ScheduleDestination;
  jocaEnabled: true;
} = {
  destination: "joca",
  jocaEnabled: true,
};
export function scheduleContactUrl(
  modality: string,
  destination = scheduleContactConfig.destination,
): string | null {
  // Jóca abre na interface; o destino WhatsApp continua disponível para encaminhamento.
  if (destination === "joca") return null;
  const message =
    "Olá! Vim pelo site da Escola Joyce Helena e gostaria de consultar os dias e horários das aulas de " +
    modality +
    ".";
  return "https://wa.me/5514998519343?text=" + encodeURIComponent(message);
}
