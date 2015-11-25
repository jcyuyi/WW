function UnauthorizedError(message) {
    this.name = "UnauthorizedError";
    this.message = typeof message === "undefined" ? undefined : message;
    this.code = 401;
}

UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;

module.exports = UnauthorizedError;
