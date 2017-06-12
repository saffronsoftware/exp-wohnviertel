## Starting the server

Use `./bin/start-dev` to start a development server.

For production, use your platform of choice to start
`NODE_ENV="production" node server.js`.

## Config

Copy `config-example.js` to `config.js`, then set the appropriate
variables if needed.

## Assets

To build and watch:

```bash
npm run gulp
```

To just build:

```bash
npm run build
```

To build in production mode:

```bash
npm run build-production
```

The gulpfile compiles in the following ways:

* `app/views/**/*.js` -> babel -> `public/javascripts/views/`
* `app/stylesheets/**/*.styl` -> stylus -> `public/stylesheets/compiled/`
* `<your configuration>` -> concat -> `public/stylesheets/build/<name>.css`
* `<your configuration>` -> concat -> `public/javascripts/build/<name>.js`
* `<your configuration>` -> browserify -> `public/javascripts/build/<name>.js`
