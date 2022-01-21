Project Structure
=====

- `.vscode` VS-Code project specific settings. The "launch.json" file specifies the launch items.
- `build/`  Directory used for builds. Do not write code here.
- `dist/`   Directory for distribution artifacts.
- `data/`   Directory for any data that needs to be stored. Point SQLIte or other data storage here.
- `doc/`    Directory containing static documentation site.
- `node_modules/` Dependencies are installed here.
- `src/`
    - `api`
        - `api-client.ts` Examples using 
        - `authorizations.ts` Examples using `@dt-esa/
    - `index.ts` Main application entrypoint. Creates Express server.
- `.gitignore`          Git Ignore.
- `ecosystem.config.js` PM2 Ecosystem file to manage the running process as a Solution.
- `package-lock.json`   NPM dependency snapshot.
- `package.json`        NPM Dependencies and SS Options are set here.
- `tsconfig.json`       Typescript configuration definitions
