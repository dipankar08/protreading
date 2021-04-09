class DError extends Error {
  subtitle: string;
  title: string;
  constructor(message: string, subtitle: string) {
    super(message);
    this.title = message;
    this.subtitle = subtitle || "";
  }
}

export function assertOrThrow(cond: boolean, title: string, subtitle: string) {
  if (!cond) {
    throw new DError(title, subtitle);
  }
}
