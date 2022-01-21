import { authorize } from "@dt-esa/authorizer";
import express from "express";

const router = express.Router();

// Authorization Samples
router.use("/auth1", authorize(['ReadConfig', "WriteConfig"]), (req, res, next) => { 
    return res.send({ message: "User has ReadConfig AND WriteConfig access." });
});

router.use("/auth2", authorize(['logs.read']), (req, res, next) => { 
    return res.send({ message: "User has Logs.read access." });
});

router.use("/auth3", authorize(['ReadConfig']), (req, res, next) => { 
    return res.send({ message: "User has ReadConfig access." });
});

router.use("/auth4", authorize(), (req, res, next) => { 
    return res.send({ message: "User is logged in." });
});

router.use("/auth5", (req, res, next) => { 
    return res.send({ message: "User may or may not be logged in. This route doesn't care." });
});

module.exports = router;