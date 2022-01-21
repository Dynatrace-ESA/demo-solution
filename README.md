# demo-solution

Sample project for writing Dynatrace Platform extensions in **NodeJS**.

> This is a work-in-progress sample project.

## Motivation

Having the ability to write a complex Dynatrace platform extension with a solid 
boilerplate that reliably integrates into Dynatrace and is written in a language 
that web developers are already familiar with:
[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/About_JavaScript),
in the form of [TypeScript](http://www.typescriptlang.org/) (a superset of JavaScript with types).
Using a number of additional custom components that were written with the express purpose of 
making things easier for developers. We cleanly integrate SSO authorization as well as show the usage
of our custom Dynatrace API interface package.

### Build & Run

To run the example application in use the following command (or use the builtin project launch.json in VS Code):

```sh
# install dependencies
$ npm install

# build and run the server
$ npm run dev
```
