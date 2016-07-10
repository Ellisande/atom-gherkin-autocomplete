# Gherkin Autocomplete Atom Package

Autocompletes gherkin steps in your feature files based on other feature files in your project.

## Usage
Simply start typing a step in a feature file. Any line that starts with Given, When, Then, or And will trigger the autocomplete.

## FAQ

### What files does it scan?
It recursively scans all `.feature` files in all directories under the `feature path` you provide in the package settings.

### Does it scan step implementations?
Not yet, it will soon though.

### Why am I getting an error with I install the package?
You probably don't have your `feature path` set right in the settings the default is `/features` make sure you point it to where your top level feature directory is.

### What is the default feature directory?
By default the package looks in the `/features` directory of your project. If you use a different convention you can change it in the package settings.

### Does it match step type?
You will see all autocomplete results from all steps you have defined in feature files. Future plans will maintain context and try to know you are looking for Given steps (for example).

### Is this any different then atom-cucumber-autocomplete?
Yes! This package was designed from the ground up to be asynchronous, uses the atom file structures for reading files, and has a broader vision for features.

## Credit
This package is based in part on the `atom-cucumber-autocomplete` package by Tom Kadwill.

## Contributing
I welcome pull requests. Feel free to add issues for things you'd like to add, questions that you have, or gripes about how the package works.
