"use strict";

const express = require("express");
const db = require("../db");
const router = new express.Router();

const { NotFoundError, BadRequestError } = require("../expressError");

/** GET /
 * Return info on invoices: like { invoices: [{ id, comp_code }, ...]; }
 */
router.get("/", async function (req, res) {
  const results = await db.query(
    `SELECT id, comp_code
        FROM invoices
        ORDER BY id`
  );
  const invoices = results.rows;
  return res.json({ invoices });
});


// GET / invoices / [id]
// Returns obj on given invoice.
// If invoice cannot be found, returns 404.

// Returns {
//   invoice: { id, amt, paid, add_date, paid_date,
//   company: { code, name, description; } }
router.get("/:id", async function (req, res) {
  let id = req.params.id;
  const resultFromId = await db.query(
    `SELECT *
    FROM invoices
    WHERE id = $1
    `, [id]
  );
  const comp_code = resultFromId.rows[0].comp_code;
  const resultForCompany = await db.query(
    `SELECT *
    FROM companies
    WHERE code = $1`,
    [comp_code]
  );
  const invoices = resultFromId.rows[0];
  const company = resultForCompany.rows[0];
  invoices.company = company;
  return res.json({ invoices });
});


//   POST / invoices
// Adds an invoice.

// Needs to be passed in JSON body of: { comp_code, amt; }

//   Returns: { invoice: { id, comp_code, amt, paid, add_date, paid_date; } }

//   PUT / invoices / [id]
// Updates an invoice.

// If invoice cannot be found, returns a 404.

// Needs to be passed in a JSON body of { amt; }

//   Returns: { invoice: { id, comp_code, amt, paid, add_date, paid_date; } }

//   DELETE / invoices / [id]
// Deletes an invoice.

// If invoice cannot be found, returns a 404.;

//   Returns: { status: "deleted"; }

//   Also, one route from the previous part should be updated:

//   GET / companies / [code]
// Return obj of company: { company: { code, name, description, invoices: [id, ...]; } }

// If the company given cannot be found, this should return a 404 status response.
module.exports = router;
