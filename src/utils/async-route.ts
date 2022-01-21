

// Important
// Express does not handle failed async route handlers by default.
// We use this wrapper to 'throw' an error when an async route has an unhandled exception.
export const route = fn => (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(next);
}