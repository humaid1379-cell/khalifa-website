export interface ArchiveState {
  query: string;
  category: string;
  year: string;
  page: number;
}

export function parseArchiveState(search: string): ArchiveState {
  const params = new URLSearchParams(search);
  const rawPage = params.get("page") || "";
  const parsedPage = /^[1-9]\d{0,6}$/.test(rawPage) ? Number(rawPage) : 1;
  const year = params.get("year") || "";
  return {
    query: params.get("q") || "",
    category: params.get("category") || "",
    year: /^\d{4}$/.test(year) ? year : "",
    page: Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1,
  };
}

export function archiveHref(state: ArchiveState): string {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category) params.set("category", state.category);
  if (state.year) params.set("year", state.year);
  if (state.page > 1) params.set("page", String(state.page));
  return `/archive${params.size ? `?${params}` : ""}`;
}
