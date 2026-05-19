export type VideoPageMeta = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  offset: number;
};

export function normalizeVideoPage(rawPage: string | number | null | undefined, totalCount: number, pageSize = 9): VideoPageMeta {
  const safePageSize = Math.min(Math.max(pageSize, 1), 24);
  const safeTotalCount = Math.max(totalCount, 0);
  const totalPages = Math.max(Math.ceil(safeTotalCount / safePageSize), 1);
  const parsedPage = typeof rawPage === "number" ? rawPage : Number.parseInt(String(rawPage ?? "1"), 10);
  const page = Number.isInteger(parsedPage) ? Math.min(Math.max(parsedPage, 1), totalPages) : 1;

  return {
    page,
    pageSize: safePageSize,
    totalCount: safeTotalCount,
    totalPages,
    offset: (page - 1) * safePageSize,
  };
}
