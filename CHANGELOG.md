# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [4.0.0](https://github.com/The-Blockchain-Company/ledgerjs-hw-app-bcc/compare/v3.2.1...v4.0.0) - [October 27th 2021]

Support for script elements in transactions and addresses.

### Added

- support for address types with script hashes (all Sophie address types are now supported)
- support for script elements in transactions via a new `TransactionSigningMode.MULTISIG_TRANSACTION`
- support for mint field in transaction body
- native script hash derivation call
- validation of canonical ordering of cbor map keys compliant with [CIP 21](https://cips.bcc.org/cips/cip21) (withdrawals, token policy ids in outputs and mint, asset names within an asset group)

### Changed

- API changes: replacing paths with stake credentials in various address and transaction parameters breaks compatibility

## [3.2.1](https://github.com/The-Blockchain-Company/ledgerjs-hw-app-bcc/compare/v3.2.0...v3.2.1) - [June 9th 2021]

Patch update removing the requirement to order token bundle canonically.

### Removed

- Temporarily remove asset groups canonical ordering validation: https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/111

## [3.2.0](https://github.com/The-Blockchain-Company/ledgerjs-hw-app-bcc/compare/v3.1.0...v3.2.0) - [May 24th 2021]

Added support for signing pool registration certificates as operator, support for pool retirement certificates within the `signTransaction()` call and added a new call for operational ceritificate signing - `signOperationalCertificate()`.

### Added

- `TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR` to allow signing pool registration as operator
- `CertificateType.STAKE_POOL_RETIREMENT`
- `signOperationalCertificate()` call

### Changed

- `PoolRegistrationParams.poolKey` has been changed from a `string` to `PoolKey` in order to support pool operator signing - `poolKey` can now also be sent as a path
- `PoolRegistrationParams.rewardAccount` has been changeed from a `string` to `PoolRewardAccount` in order to support pool operator signing - `rewardAccount` can now also be sent as path
- `AssetGroup.tokens` and `TxOutput.tokenBundle` are required to be in CBOR canonical order

## [3.1.0](https://github.com/The-Blockchain-Company/ledgerjs-hw-app-bcc/compare/v3.0.0...v3.1.0) - [May 11th 2021]

Added support for Catalyst voting registration metadata creation within the `signTransaction()` call, introduced in Ledger Bcc app version 2.3.2.

### Added

- automatically generated flow types from typescript source: https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/102

### Changed

- added Catalyst voting registration support: https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/99
- relaxed validation of `signTransaction()` call `ttl` and `validityIntervalStart` parameter to allow zero value
- `AddressParamsReward` now requires staking key path as the `stakingPath` property instead of `spendingPath` (which was misleading)

### Fixed

- validation of zero numerical values, previously the library was incorrectly failing for any zero value passed

## [3.0.0](https://github.com/The-Blockchain-Company/ledgerjs-hw-app-bcc/compare/v2.2.1...v3.0.0) - [April 13th 2021]

Major release. Switched from flow to TypeScript.

### Changed

- All API calls now use single structured argument instead of long list of partial arguments.
  (For the overview see `src/Bcc.ts` changes in https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/61)
- `AddressTypeNibble` enum renamed to `AddressType`
- `derive/showAddress` now take `network` as an explicit parameter instead of `networkIdOrProtocolMagic` field in `AddressParams`
- all 64-bit integers that were previously stored in fields ending with `Str` (e.g. `feeStr`) are now without the suffix (i.e. `fee`) and take a "bignumber-like" argument which can be `Number` (if it is small enough, i.e. `<= Number.MAX_SAFE_INTEGER`), string, or native `BigInt`. Non-native bigint implementations are not supported and should be converted to strings)
- all "tagged enums" now use `{type: SomeType.Variant, params: SomeTypeVariantParams}` typing. This unified previously mixed tagging with sometimes arbitrarily variant fields into the parent type. As part of this change
  - Relays are now typed properly with variants
  - TxOutput was separated into "amount" part (amount & tokenBundle) & `destination` specification.
    - Destination is now explicitly of type `DestinationType.ThirdParty` or `DestinationType.DeviceOwned` to clarify what the device should sign
    - Device owned destination reuses existing `Address` param type
  - `Address` is now tagged enum across different address types (Cole, Base, Enterprise, Pointer, Reward). Reward address still uses `spendingPath` instead of `stakingPath` to denote that this key can be used to spend funds
- All API call types now use `*Request`/`*Response` nomenclature
- GetVersion call now returns `{version, compatibility}` instead of `version` where `compatibility` describes overall set of features we support for the device. It should be responsibility of API users to check `compatibility.isCompatible` flag and urge users to upgrade device to `compatibility.recommendedVersion` if the device is not compatible.
- All (expected) errors thrown by the API are now descendants of `ErrorBase` from `errors` subpackage. API now distinguishes between these error types
  - `InvalidData` - you passed some wrong data to the API. We will not even try to communicate with the device
  - `DeviceUnsupported` - thrown when trying to use API with unsopported Ledger app version (or when using features not yet available for the app version)
  - `DeviceStatusError` - thrown when device rejects operation for some reason. Common reasons are found in `DeviceStatusCodes` mapping.
- There is new documentation available at (https://vacuumlabs.github.io/ledgerjs-bcc-sophie/index.html)

### Removed

- Compatibility with pre-Jen (<2.2) App versions.

## [2.2.1](https://github.com/The-Blockchain-Company/ledgerjs-hw-app-bcc/compare/v2.2.0...v2.2.1) - [February 18th 2021]

Patch release with a minor fix in signTransaction() call's parameters validation

### Added

### Changed

### Fixed

- relax the tokenBundle feature check to allow an empty array https://github.com/The-Blockchain-Company/ledgerjs-hw-app-bcc/pull/17

## [2.2.0](https://github.com/The-Blockchain-Company/ledgerjs-hw-app-bcc/compare/v2.1.0...v2.2.0) - [February 8th 2021]

Works with Ledger Bcc app 2.2.0 and is backwards compatible with older versions down to 2.0.4/2.0.5\*. Older versions of this js library do not support Ledger Bcc app 2.2.0, hence an update to this version of the library is required before Ledger Bcc app 2.2.0 is released.

### Added

- Support for Evie-era transaction min validity property, transaction TTL is now optional: https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/27/files
- Support for Jen-era multiasset outputs (no minting yet) https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/27/files
- Update docs with a stake pool registration (as an owner) example https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/23

### Changed

### Fixed

- Fixed incorrect validation of numerical parameters passed as strings which failed for values over JS max safe integer: https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/29

## [2.1.0](https://github.com/The-Blockchain-Company/ledgerjs-hw-app-bcc/releases/tag/v2.1.0) - [December 11th 2020]

Works with Ledger Bcc app 2.1.0 and is backwards compatible with 2.0.4/2.0.5 as well\*. Older versions of this library do not support Ledger Bcc app 2.1.0, therefore an update to this version of the library is required before Ledger Bcc app 2.1.0 is released.

### Added

- Support for bulk public key export https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/13/files
- Support for stake pool registration certificate as a pool owner https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/12
- Docs for available calls https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/17

### Changed

- Allow transactions without outputs: https://github.com/vacuumlabs/ledgerjs-bcc-sophie/pull/16
- Updated flow types for Certificates, [commit](https://github.com/vacuumlabs/ledgerjs-bcc-sophie/commit/c50d383fe65e0db1787bda39984423f165bf0316#diff-6e0ee7e0e42296aeb681e34e50808e744aeeeff03702bab5ab7994bb4e0562e3)

### Fixed

## [2.0.1] - [August 20th 2020]

### Added

- Certificate and address type Flow enums, [commit](https://github.com/vacuumlabs/ledgerjs-bcc-sophie/commit/df08b3fdb7383b1065e7ad971626430a126f98aa)

### Changed

### Fixed

## [2.0.0] - [August 18th 2020]

First release with Sophie-era support, works with Ledger Bcc app version 2.0.4 (Nano S) and 2.0.5 (Nano X). Older versions of this library no longer work with the Bcc blockchain.

### Added

### Changed

### Fixed

\* _backwards compatibility refers only to features supported by the respective app versions, unsupported features result in an error being thrown._
