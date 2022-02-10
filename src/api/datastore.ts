import { authorize } from "@dt-esa/authorizer";
import express from "express";
import level from 'level';

const router = express.Router();

// Level creates a database relative to entry file. (server/index.ts)
const db = level("../data/datastore");

// Example CRUD implementation of routes with authorization.
// Keep the following in mind:
// When handling api input, SANITIZE IT. Even if it's not from a user.
// Malicious users will intentionally formulate requests to try to exploit a system.
// This example doesn't need sanitization as we aren't doing ANY processing
// on the data. We simply read or store the values.
//
// LevelDB Will _NOT_ work with clustered node processes. You would have to use 
// IPC to use it across instances.


/// Interfacing with a database. In this example, a local leveldb instance.
// Get entries from the database.
router.get("/data/:key", authorize(["WriteConfig"]), (req, res, next) => {
    const key = req.params.key;
    const value = req.body.value;
    db.put(key, JSON.stringify(value))
        .then(() => res.send("success"))
        .catch(next);
});

// Store entries in the database.
router.post("/data/:key", authorize(['ReadConfig']), (req, res, next) => {
    const key = req.params.key;
    db.get(key)
        .then(data => res.send(data))
        .catch(next);
});

// Delet entries from the database.
router.delete("/data/:key", authorize(['WriteConfig']), (req, res, next) => {
    const key = req.params.key;
    db.del(key)
        .then(() => res.send("success"))
        .catch(next);
});

module.exports = router;