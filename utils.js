const { BadRequestError } = require("./expressError");

function validateBody(req, res, next) {
    if (req.body.code === undefined)
        throw new BadRequestError("Please provide code, name, and description");
    if (req.body.name === undefined)
        throw new BadRequestError("Please provide code, name, and description");
    if (req.body.description === undefined)
        throw new BadRequestError("Please provide code, name, and description");

    return next();
}

module.exports = { validateBody };
