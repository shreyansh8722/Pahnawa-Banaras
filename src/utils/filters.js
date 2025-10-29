/* ---------------------- Filters ---------------------- */
export const FILTER_OPTIONS = [
  { id: "All", label: "All" },
  { id: "Popular", label: "Popular" },
  { id: "Budget", label: "Budget Friendly" },
  { id: "Recommended", label: "Recommended" },
];

export function applyGlobalFilter(arr, filter) {
  if (!filter || filter === "All") return arr;
  if (filter === "Popular") return arr.filter((s) => (s.averageRating ?? 0) >= 4.5);
  if (filter === "Budget")
    return arr.filter((s) => {
      const price = s.priceRange?.match(/\d+/g);
      return price && Number(price[0]) <= 350;
    });
  if (filter === "Recommended") return arr.filter((s) => (s.reviewCount ?? 0) > 10);
  return arr;
}