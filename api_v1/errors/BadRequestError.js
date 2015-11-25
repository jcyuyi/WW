function BadRequestError(message) {
    this.name = "BadRequestError";
    this.message = typeof message === "undefined" ? undefined : message;
    this.code = 400;
}

BadRequestError.prototype = Object.create(Error.prototype);
BadRequestError.prototype.constructor = BadRequestError;

module.exports = BadRequestError;