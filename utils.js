const { BadRequestError } = require("./expressError");

function validatePost(req, res, next) {
    if (req.body.code === undefined)
        throw new BadRequestError("Please provide code");
    if (req.body.name === undefined)
        throw new BadRequestError("Please provide name");
    if (req.body.description === undefined)
        throw new BadRequestError("Please provide description");

    return next();
}

function validatePut(req, res, next) {
    if (req.body.name === undefined)
        throw new BadRequestError("Please provide name");
    if (req.body.description === undefined)
        throw new BadRequestError("Please provide description");

    return next();
}
module.exports = { validatePost, validatePut };
