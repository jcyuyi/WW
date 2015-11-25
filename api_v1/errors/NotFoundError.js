function NotFoundError(message) {
    this.name = "NotFoundError";
    this.message = message === "undefined" ? undefined : message;
    this.code = 404;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

module.exports = NotFoundError;