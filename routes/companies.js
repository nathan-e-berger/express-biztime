"use strict";

const express = require("express");
const db = require("../db");
const router = new express.Router();

const { NotFoundError, BadRequestError } = require("../expressError");
const { validatePost, validatePut } = require("../utils");

/**
 * GET /companies
 * Returns : {companies: [{code, name, description}, ...]}
 */
router.get("/", async function (req, res) {
    const results = await db.query(
        `SELECT *
        FROM companies`
    );
    const companies = results.rows;
    return res.json({ companies });
});

/**
 * GET /companies/[code]
 * Return : {company: {code, name, description}}
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

/**
 * POST /companies
 * Accepts : {code, name, description}
 * Returns : {company: {code, name, description}}
 */
router.post("/", validatePost, async function (req, res) {
    const { code, name, description } = req.body;

    const results = await db.query(
        `INSERT INTO companies(code, name, description) VALUES($1, $2, $3) RETURNING code, name, description`,
        [code, name, description]
    );

    const company = results.rows[0];
    return res.json({ company });
});

/**
 * PUT /companies/[code]
 * Accepts : {name, description}
 * Returns : {company: {code, name, description}}
 */
router.put("/:code", validatePut, async function (req, res) {
    const { name, description } = req.body;
    const { code } = req.params;

    const results = await db.query(
        `UPDATE companies SET name=$2, description=$3
      WHERE code = $1
        RETURNING code, name, description`,
        [code, name, description]
    );
    if (!results.rows.length)
        throw new BadRequestError("There doesnt seem to be anything here");

    const company = results.rows[0];
    return res.json({ company });
});

/**
 * DELETE /companies/[code]
 * Returns : { {status: "deleted"} }
 */
router.delete("/:code", async function (req, res) {
    const { code } = req.params;

    const results = await db.query(
        `DELETE FROM companies
      WHERE code = $1
        RETURNING code`,
        [code]
    );

    return res.json({ status: "deleted" });
});

module.exports = router;
