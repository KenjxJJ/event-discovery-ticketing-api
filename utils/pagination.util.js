/**
 * Generates standardized pagination metadata for collection responses.
 *
 * @param {number} page - Current page number
 * @param {number} limit - Items per page limit
 * @param {number} total - Total count of matched documents
 * @returns {{ page: number, limit: number, total: number, totalPages: number }}
 */
function paginationResponse(page, limit, total) {
    const numPage = Number(page);
    const numLimit = Number(limit);
    const numTotal = Number(total);
    return {
        page: numPage,
        limit: numLimit,
        total: numTotal,
        totalPages: Math.ceil(numTotal / numLimit),
    };
}

module.exports = {
    paginationResponse,
};
