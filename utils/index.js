const createRefObj = (data, docs) => {
  return data.reduce((acc, datum, index) => {
    acc[datum.username] = docs[index]._id;
    return acc;
  }, {})
}

const createArticleRefObj = (data, docs) => {
  return data.reduce((acc, datum, index) => {
    acc[datum.title] = docs[index]._id;
    return acc;
  }, {})
}

const formatArticleData = (articlesData, userRef) => {
  return articlesData.map(articleDatum => {
    const { title, body, belongs_to, votes, created_by } = articleDatum;
    return {
      ...articleDatum,
      created_by: userRef[articleDatum.created_by],
      belongs_to: articleDatum.topic
    }
  })
}

const formatCommentData = (commentsData, articleRef, userRef) => {
  return commentsData.map(commentDatum => {
    const { body, belongs_to, created_at, votes, created_by } = commentDatum;
    return {
      ...commentDatum,
      belongs_to: articleRef[commentDatum.belongs_to],
      created_by: userRef[commentDatum.created_by]
    }
  })
}

module.exports = { createRefObj, createArticleRefObj, formatArticleData, formatCommentData }









// const formatArticlesData = (articlesData) => {
//   return articlesData.map(articleDatum => {
//     return {
//       ...articleDatum,
//       belongs_to: articleDatum.topic
//     }
//   })
// }

// const formatCompanyData = (companyData) => {
//   return companyData.map(companyDatum => {
//     return {
//       ...companyDatum,
//       hq: companyDatum.headquarters
//     }
//   })
// }