![image](https://user-images.githubusercontent.com/837681/53001830-d7c8a600-342b-11e9-9038-e745cc91e543.png)

### @The-Blockchain-Company/ledgerjs-hw-app-bcc

JS Library for communication with Ledger Hardware Wallets.
This library is compatible with the [Bcc BCC Ledger Application](https://github.com/The-Blockchain-Company/ledger-app-bcc).

Note: this project comes with both [Typescript](https://www.typescriptlang.org/) and [Flow](https://flow.org/) type definitions, but only the Typescript ones are checked for correctness.

### Example code

Example code interacting with `hw-app-bcc` is provided in `example-node` directory.
You can execute it with the `yarn run-example` command.

### Tests

Automated tests are provided. There are two types of tests

1. `yarn test-integration`. Tests JS api.
2. `yarn test-direct`. Mostly tests for different corner cases. There are some extensive tests which are disabled by default, see tests source code.

Note that for these tests it is advisable to install the developer build of the Bcc app with _headless_ mode enabled unless you want to verify the UI flows, otherwise you will need a significant amount of time to manually confirm all prompts on the device.

### Documentation

- you can build the docs by running `yarn gen-docs` and then navigate to docs_generated/index.html
- generated docs can also be found at (https://vacuumlabs.github.io/ledgerjs-bcc-sophie)
- [CHANGELOG](CHANGELOG.md)
