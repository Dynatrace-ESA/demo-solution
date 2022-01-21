#!/usr/bin/env node
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import https from 'https';
import compression from 'compression';
import createError from 'http-errors';
import expressSession from 'express-session';
import selfsigned from 'selfsigned';
import fs from 'fs';
import Chalk from 'chalk';
import { authentication } from '@dt-esa/authorizer';
import dotenv from "dotenv";
dotenv.config();

try {
    
    // Setup base app middleware.
    const app: Express = express();

    // Enable compression. Don't compress responses when explicitly asked not to.
    app.use(compression({
        filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res)
    }));
    
    app.use(cookieParser());
    app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
    app.use(express.urlencoded({ extended : true }));


    app.use(authentication({
        mode: 'client',
        clientConnectionPort: 6800
    }));
    
    // Enable JSON requests/responses.
    app.use(express.json());
    
    // Add layers from "api".
    app.use(require("./api/api-client"));
    app.use(require("./api/authorization"));
    
    // Handle 404s.
    app.use((req, res, next) => next(createError(404)));
    
    // Handle all 5xx errors here.
    app.use((err: any, req: any, res: any, next: any) => {
    
        const error = err.stack || err.message || err.toString();
    
        // Don't bother logging 404 errors in the general log.
        if (err.status != 404)
            console.error(error);
    
        // Render the error page.
        res.status(err.status || 500);
    
        // If the browser is accepting HTML in the request, we'll render a nice error page.
        // Otherwise: JSON.
        res.send(error);
    });
    
    // SSL Certificate setup.
    let sslKey;
    let sslCert;
    
    const dataDir = __dirname + "/../data/";
    
    // Check for a data directory and if it contains "generated.key" & "generated.crt" files.
    if (fs.existsSync(dataDir + 'generated.crt')) {
        sslKey  = fs.readFileSync(dataDir + 'generated.key', { encoding: 'utf8' });
        sslCert = fs.readFileSync(dataDir + 'generated.crt', { encoding: 'utf8' });
    } // If not, then generate a certificate.
    else {
        const signedCert = selfsigned.generate(
            [{ name: 'commonName', value: 'services.dynatrace.corp' }], 
            { days: 365*2 }
        );
    
        sslKey  = signedCert.private;
        sslCert = signedCert.cert;
    
        if(!fs.existsSync(dataDir))
            fs.mkdirSync(dataDir);
    
        fs.writeFileSync(dataDir + 'generated.key', sslKey);
        fs.writeFileSync(dataDir + 'generated.crt', sslCert);
    }
    
    // Create the HTTPS server.
    const server = https.createServer({
        key:  sslKey,
        cert: sslCert
    }, app);
    
    // Set port. 
    // @ts-ignore
    const port = parseInt(process.env["PORT"] || 6810);
    
    server.listen(port);
    server.on('error', (error: any) => {
        if (error.syscall !== 'listen') 
            throw error;
        
        // Report friendly errors where we can.
        switch (error.code) {
            case 'EACCES':
                console.error('Port ' + port + ' requires elevated privileges');
                process.exit(1);
            case 'EADDRINUSE':
                console.error('Port ' + port  + ' is already in use');
                process.exit(1);
            default:
                throw error;
        }
    });
    server.on('listening', () => {
        const addr: any = server.address();
        console.log("Server %s listening on %s.", process.pid, addr.port || addr);
    });
}
catch (ex) {
    console.error(ex)
}