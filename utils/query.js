const defaultPageLimit = 0
const defaultPageNumber = 1

function getPadination(query) {
    console.log("query",query);
    const limit = Math.abs(query.limit) || defaultPageLimit
    const page = Math.abs(query.page) || defaultPageNumber

    console.log("page", page);

    const skip = (page-1) * limit

    return {
        skip: skip,
        limit: limit
    }
}

module.exports = getPadination