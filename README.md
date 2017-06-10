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

To enable minification (using `--production` option):

```bash
npm run build-production
```

### Files

#### js
Source: `app/views/**/*.js`

Destination: `public/javascripts/views/`

#### stylus
Source: `app/stylesheets/**/*.styl`

Destination: `public/stylesheets/compiled/`

#### CSS concat
Source: see gulpfile.

Destination: `public/stylesheets/build/#{name}.js`

```javascript
cssBuildGroups = [
  {
    dest: 'all.css',
    src: [
      './public/stylesheets/views/fonts.css',
      './public/stylesheets/views/layout.css',
    ],
  },
]
```

#### Javascript concat
Source: see gulpfile.

Destination: `public/javascripts/build/#{name}.js`

```javascript
jsBuildGroups = [
  {
    dest: 'all.js',
    src: [
      './public/javascripts/views/home.js',
      './public/javascripts/views/contact.js',
    ],
  },
]
```
