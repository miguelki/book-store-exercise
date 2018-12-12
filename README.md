# Book Store Exercise

Time spent:
- Basic implementation:
  - Initial readup/book list building/module search: 20min
  - Implementation: 1h20
  - Total: 1h40min
- Advanced feature: Online book store
  - Module/db search: 30m
  - Implementation: 3h
  - Total: 3h30min
- Final housekeeping (writing readme, pushing to GitHub): 10min

Total: 5h20 min

## Basic implementation

_Note_: The command parser I use only recognizes long parameters when using double hyphens, so instead of `myapp.exe -help` it will have to be called using `node app.js -h` or `node app.js --help`. The list of books used is stored as a plain JSON object in `basic-book-store/books.list.json`.

### How to run it:

```
> cd basic-book-store
> npm install
> node app.js -h
```

### If I had more time and nice-to-haves:
- Move functions to a module
- Alphabetical sorting
- Nicer table header formatting when in the filtered list view
- Error handling, for example when passing unknown parameters

## Advanced feature: Online book store

_Notes_: It uses React for the front-end, and an Express server for the back-end. I used the `create-react-app` boilerplate to get the React skeleton & basic folder structure, and added only a minimal amount of styling.

### How to run it:

You need to have the 2 servers running in 2 different terminal instances>

* Back-end server (default url: http://localhost:5000):
```
> cd online-book-store/server
> npm install
> node app.js
```

* Front-end server (default url: http://localhost:3000):
```
> cd online-book-store/client
> npm install
> npm start
```

### If I had more time and nice-to-haves:

- Server side:
  - Move helper functions and db access calls to separate modules
  - Move routes to a separate module
  - Optimisation (there are some redundancies in the code, especially in the order/return endpoints)
- Front-end side:
  - Network requests error handling
  - Folder structure cleanup: move components in a `Components` folder, logic code in their own category, etc
  - The data refresh triggered on order/return could use some tidying up (redundancy)
  - Cosmetic improvements (CSS, table sorting, images)

Thank you for reading :)
