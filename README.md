# Space Switcher

## Implementation

The space switcher is implemented as a React component. 

You can append it to your application by invoking it like this:

```
React.render(<SpaceSwitcher endpoint="spaces.json"/>, DOMElement);
```

You can pass in the object with the spaces data instead, if you don't want it to async load the spaces.

```
React.render(<SpaceSwitcher data={spacesObject} />, DOMElement);
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
- [x] Write the README.md including the requirements and the documentation on how to launch the environment.
- [x] Write a component for loading the spaces through ajax.
- [x] Create a component that lists the organizations and their spaces
- [x] Add a toggable behaviour on click for this component. Close it if I press "esc" or click outside it.
- [x] Create a searcher component, that receives text input and triggers an event with the result.
- [x] Reset the results on delete when the users hits the "delete" key.
- [x] Highlight the part of the text that matches the filter of the searcher
- [ ] Add key up / key down behaviour for navigating though the results


### Contribute

Any idea or consideration is accepted for improving this solution.