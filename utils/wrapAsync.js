module.exports = (fn) => {
    return  (req, res, next) => {
        fn(req, res, next).catch(err => next(err))
    }
}
// instead of  try catch in async await