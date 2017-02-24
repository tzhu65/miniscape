# miniscape


## Getting Started

1. Make sure you have node and npm installed
2. Install node globals with `npm install -g bower gulp typings`
3. Install local node modules with `npm install`
4. Install bower packages (none at the moment) with `bower install`
5. Install typescript definitions with `typings install`
6. Run `gulp watch` and go to localhost:3000


## Gulp Commands
`gulp clean` - clears out the `server/public/` directory  
`gulp compile` - compiles the scss, images, html, and typescript  
`gulp watch` - compiles everything and continously watches for changes  
`gulp minify` - the minified version of `gulp compile`  
`gulp` - defaults to `gulp watch`  

The remaining gulp commands can be found in `gulpfile.js`
