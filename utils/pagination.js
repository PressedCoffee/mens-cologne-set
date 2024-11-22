export function getPaginationData(
  totalItems,
  currentPage = 1,
  itemsPerPage = 24
) {
  // Calculate total number of pages needed
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate starting index for current page
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Calculate ending index for current page
  const endIndex = startIndex + itemsPerPage;

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    // Boolean flags for pagination controls
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
