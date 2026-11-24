export type FigureData = {
  P: unknown;
  travel: number;
  stations: readonly { id: string; name: string; angle: number }[];
  trace: readonly unknown[];
  gauge: readonly number[];
  top: number;
  hubTop: number;
};

export function mountFigure(
  stage: HTMLElement,
  figure: FigureData,
  options?: { onReadout?: (text: string) => void; onSelect?: (id: string) => void },
): {
  select(id: string): void;
  highlight(id: string): void;
  playRange(fromIdx: number, toIdx: number): void;
  playLoop(): void;
  destroy(): void;
};
