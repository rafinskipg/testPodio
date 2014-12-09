# Space Switcher

## Implementation

The space switcher is implemented as a React component. 

You can append it to your application by invoking it like this:

```
React.render(<SpaceSwitcher endpoint="/_json/spaces.json"/>, DOMElement);
```

You can pass in the object with the spaces data instead, if you don't want it to async load the spaces.

```
React.render(<SpaceSwitcher spaces={spacesObject} />, DOMElement);
```

### Comunication

Instead of using promises for the async loading, I've choosen an event communication, so you can scale the application for reusing that calls to the API.

### Packages

Bundled with Browserify for fun and eficiency. 

![Image browserify](https://camo.githubusercontent.com/85bbf6097b0237b921ef2bb232c2dc807604e865/687474703a2f2f737562737461636b2e6e65742f696d616765732f62726f777365726966792f62726f777365726966792e706e67)

## Installation

Use the typical install:

```
npm install
bower install
```

Run with grunt

```
grunt serve
```

## Tasks

> Break down the requirements below into manageable user stories and development tasks. You can do this in any way you prefer, but an agile approach is recommended.

So, following theese indications: 

- [x] Boilerplate the enviroment
- [x] Write the README.md
- [x] Write a component for loading the spaces json
- [ ] Create a component that lists the organizations and their spaces
- [ ] Add a toggable behaviour to that component
- [ ] Add a searcher
- [ ] Reset the results on delete
- [ ] Add key up / key down behaviour for navigating though the results


### Contribute

Any idea or consideration is accepted for improving this solution.