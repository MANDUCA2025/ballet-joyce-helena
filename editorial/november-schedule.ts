export type ScheduleEntry = {
  id: string;
  days: string;
  time: string | null;
  note?: string;
};
// Fonte temporal: NOVEMBRO/2026, coluna TURMA, transcrita no pedido SITE-JOYCE-005C.
// Conferência direta do arquivo XLSX pendente de localização. Nenhum dado de aluna importado.
export const jointSaturday: ScheduleEntry = {
  id: "infantil-preparatorio-sabado",
  days: "Sábado",
  time: "11h",
  note: "Turma conjunta Infantil/Preparatório",
};
export const novemberSchedule: Record<string, ScheduleEntry[]> = {
  Baby: [
    { id: "baby-seg", days: "Segunda-feira", time: "18h" },
    { id: "baby-qua", days: "Quarta-feira", time: "18h" },
    { id: "baby-sab", days: "Sábado", time: "10h" },
  ],
  "Pré-Ballet": [
    { id: "pre-ter", days: "Terça-feira", time: "19h" },
    { id: "pre-qui", days: "Quinta-feira", time: "19h" },
    { id: "pre-sab", days: "Sábado", time: "9h" },
  ],
  Infantil: [
    { id: "infantil-seg", days: "Segunda-feira", time: "19h" },
    { id: "infantil-qua", days: "Quarta-feira", time: "19h" },
    jointSaturday,
  ],
  Preparatório: [
    {
      id: "ponta-ter-qui",
      days: "Terça e quinta-feira",
      time: "20h",
      note: "Ponta",
    },
    jointSaturday,
    {
      id: "ponta-segundo-ano",
      days: "Ponta · 2º ano",
      time: null,
      note: "Dia e horário a confirmar",
    },
  ],
};
