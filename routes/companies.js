"use strict";

const { NotFoundError, BadRequestError } = require("../expressError");
const express = require("express");
const { validateBody } = require("../utils");
const db = require("../db");

const router = new express.Router();

router.get("/", async function (req, res) {
    const results = await db.query(
        `SELECT *
        FROM companies`
    );
    const companies = results.rows;
    return res.json({ companies });
});

/** GET /companies/[code]
 * Return obj of company: {company: {code, name, description}}
 * If the company given cannot be found, this should return a 404 status response.
 */
router.get("/:code", async function (req, res) {
    const { code } = req.params;

    const results = await db.query(`SELECT * FROM companies WHERE code = $1`, [
        code,
    ]);

    const company = results.rows[0];

    if (!company) throw new NotFoundError("Company not found");

    return res.json({ company });
});

// POST /companies
// Adds a company.
// Needs to be given JSON like: {code, name, description}
// Returns obj of new company: {company: {code, name, description}}
router.post("/", validateBody, async function (req, res) {
    // for(req.body )
    //   if (req.body.code === undefined)
    //       throw new BadRequestError("Please provide code, name, and description");
    //   if (req.body.name === undefined)
    //       throw new BadRequestError("Please provide code, name, and description");
    //   if (req.body.description === undefined)
    //       throw new BadRequestError("Please provide code, name, and description");

    const { code, name, description } = req.body;

    const results = await db.query(
        `INSERT INTO companies(code, name, description) VALUES($1, $2, $3) RETURNING code, name, description`,
        [code, name, description]
    );

    const company = results.rows[0];
    return res.status(201).json({ company });
});

// PUT /companies/[code]
// Edit existing company.
// Should return 404 if company cannot be found.
// Needs to be given JSON like: {name, description}
// Returns update company object: {company: {code, name, description}}
router.put("/:code", async function (req, res) {
    if (req.body.code === undefined)
        throw new BadRequestError("Please provide code, name, and description");
    if (req.body.name === undefined)
        throw new BadRequestError("Please provide code, name, and description");
    if (req.body.description === undefined)
        throw new BadRequestError("Please provide code, name, and description");

    const { code, name, description } = req.body;

    const results = await db.query(
        `INSERT INTO companies(code, name, description) VALUES($1, $2, $3) RETURNING code, name, description`,
        [code, name, description]
    );

    const company = results.rows[0];
    return res.status(201).json({ company });
});

module.exports = router;
