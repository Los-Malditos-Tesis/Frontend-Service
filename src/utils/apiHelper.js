export function normalizeResponse(response, success = true) {
  const { items, total, totalPages, currentPage } = response.data.data;

  return {
    data: items,
    pagination: {
      total,
      totalPages,
      currentPage
    },
    success
  };
}

export function buildErrorResponse(error, customMessage = "Error inesperado", sendNullData = false) {
  return {
    data: sendNullData ? null : [],
    pagination: null,
    success: false,
    error: customMessage,
    details: error?.message || null,
  };
}