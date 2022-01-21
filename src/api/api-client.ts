import { DynatraceEnvironmentAPIV1, DynatraceTenantAPI } from "@dt-esa/dynatrace-api-client";
import express from "express";
import { route } from "../utils/async-route";

const router = express.Router();

let apiv1: DynatraceEnvironmentAPIV1;
let apiPaas: DynatraceEnvironmentAPIV1;
let apiEnv: DynatraceTenantAPI;

// Closure exists to collapse initialization.
{
    try {
        apiv1 = new DynatraceEnvironmentAPIV1({
            url: process.env['TENANT_URL'],
            token:  process.env['TENANT_TOKEN']
        });
    }
    catch(ex) {
        console.log("Failed to create API Client");
    }
    
    try {
        apiPaas = new DynatraceEnvironmentAPIV1({
            url: process.env['TENANT_URL'],
            token: process.env['TENANT_PAAS_TOKEN']
        });
    }
    catch (ex) {
        console.log("Failed to create API Client");
    }
    
    try {
        apiEnv = new DynatraceTenantAPI({
            url: process.env['TENANT_URL'],
            token: process.env['TENANT_TOKEN']
        });
    }
    catch (ex) {
        console.log("Failed to create API Client");
    }
}
// API Interface Samples

// Setup API routes for use with the UI.
router.use("/api1", route(async (req, res, next) => {
    
    const data = await apiv1.oneagents.getHostsWithSpecificAgents();

    apiv1.events.queryEvents().then(events => {
        let data = events.events.filter(e => e.endTime > 2);
        res.send(data);
    }).catch(next);
}));

// Get OneAgents
router.use("/api2", (req, res, next) => { 
    apiv1.oneagents.getHostsWithSpecificAgents().then(hosts => {
        res.send(hosts);
    }).catch(next);
});

// Get problem Feed.
router.use("/api3", (req, res, next) => { 
    apiv1.problem.getFeed().then(feed => {
        res.send(feed);
    }).catch(next);
});

module.exports = router;