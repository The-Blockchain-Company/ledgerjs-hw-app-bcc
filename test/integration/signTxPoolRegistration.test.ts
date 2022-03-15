import chai, { expect } from "chai"
import chaiAsPromised from "chai-as-promised"

import type Bcc from "../../src/Bcc"
import type { Certificate, Transaction } from "../../src/Bcc"
import { CertificateType, InvalidDataReason, TransactionSigningMode } from "../../src/Bcc"
import { getBcc, Networks } from "../test_utils"
import type { Testcase } from "./__fixtures__/signTxPoolRegistration"
import {
    certificates,
    defaultPoolRegistration,
    inputs,
    invalidCertificates,
    invalidPoolMetadataTestcases,
    invalidRelayTestcases,
    outputs,
    poolRegistrationOperatorTestcases,
    poolRegistrationOwnerTestcases,
    withdrawals,
} from "./__fixtures__/signTxPoolRegistration"
chai.use(chaiAsPromised)

describe("signTxPoolRegistrationOKOwner", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    const test = (testcases: Testcase[], signingMode: TransactionSigningMode) => {
        for (const { testname, tx, result: expectedResult } of testcases) {
            it(testname, async () => {
                const response = await bcc.signTransaction({
                    tx,
                    signingMode,
                    additionalWitnessPaths: [],
                })
                expect(response).to.deep.equal(expectedResult)
            })
        }
    }

    test(poolRegistrationOwnerTestcases, TransactionSigningMode.POOL_REGISTRATION_AS_OWNER)
})

describe("signTxPoolRegistrationOKOperator", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    const test = (testcases: Testcase[], signingMode: TransactionSigningMode) => {
        for (const { testname, tx, result: expectedResult } of testcases) {
            it(testname, async () => {
                const response = await bcc.signTransaction({
                    tx,
                    signingMode,
                    additionalWitnessPaths: [],
                })
                expect(response).to.deep.equal(expectedResult)
            })
        }
    }

    test(poolRegistrationOperatorTestcases, TransactionSigningMode.POOL_REGISTRATION_AS_OPERATOR)
})

// ======================================== negative tests (tx should be rejected) ===============================

describe("signTxPoolRegistrationRejectOwner", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    const txBase: Omit<Transaction, 'certificates'> = {
        network: Networks.Mainnet,
        inputs: [inputs.utxoNoPath],
        outputs: [outputs.external],
        fee: 42,
        ttl: 10,
    }

    for (const { testName, poolRegistrationCertificate, expectedReject } of invalidCertificates) {
        it(`Reject ${testName}`, async () => {
            const tx: Transaction = {
                ...txBase,
                certificates: [poolRegistrationCertificate],
            }
            const promise = bcc.signTransaction({
                tx,
                signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
                additionalWitnessPaths: [],
            })

            await expect(promise).to.be.rejectedWith(expectedReject)
        })
    }

    for (const { testName, metadata, rejectReason } of invalidPoolMetadataTestcases) {
        it(`Reject ${testName}`, async () => {
            const cert: Certificate = {
                type: CertificateType.STAKE_POOL_REGISTRATION,
                params: {
                    ...defaultPoolRegistration,
                    metadata,
                },
            }

            const tx: Transaction = {
                ...txBase,
                certificates: [cert],
            }
            const promise = bcc.signTransaction({
                tx,
                signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
                additionalWitnessPaths: [],
            })
            await expect(promise).to.be.rejectedWith(rejectReason)
        })
    }

    describe("Reject pool registration with invalid relays", async () => {
        for (const { testname, relay, rejectReason } of invalidRelayTestcases) {
            it(testname, async () => {
                const cert: Certificate = {
                    type: CertificateType.STAKE_POOL_REGISTRATION,
                    params: {
                        ...defaultPoolRegistration,
                        relays: [relay],
                    },
                }

                const tx: Transaction = {
                    ...txBase,
                    certificates: [cert],
                }
                const promise = bcc.signTransaction({
                    tx,
                    signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
                    additionalWitnessPaths: [],
                })
                await expect(promise).to.be.rejectedWith(rejectReason)
            })
        }
    })


    it("Reject pool registration with numerator bigger than denominator", async () => {
        const tx: Transaction = {
            ...txBase,
            certificates: [certificates.poolRegistrationWrongMargin],
        }
        const promise = bcc.signTransaction({
            tx,
            signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
            additionalWitnessPaths: [],
        })

        await expect(promise).to.be.rejectedWith(InvalidDataReason.POOL_REGISTRATION_INVALID_MARGIN)
    })

    it("Reject pool registration along with other certificates", async () => {
        const tx: Transaction = {
            ...txBase,
            certificates: [
                certificates.poolRegistrationDefault,
                certificates.stakeDelegation,
            ],
        }
        const promise = bcc.signTransaction({
            tx,
            signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
            additionalWitnessPaths: [],
        })

        await expect(promise).to.be.rejectedWith(InvalidDataReason.SIGN_MODE_POOL_OWNER__SINGLE_POOL_REG_CERTIFICATE_REQUIRED)
    })

    it("Reject pool registration along with a withdrawal", async () => {
        const tx: Transaction = {
            ...txBase,
            certificates: [certificates.poolRegistrationDefault],
            withdrawals: [withdrawals.withdrawal0],
        }
        const promise = bcc.signTransaction({
            tx,
            signingMode: TransactionSigningMode.POOL_REGISTRATION_AS_OWNER,
            additionalWitnessPaths: [],
        })

        await expect(promise).to.be.rejectedWith(InvalidDataReason.SIGN_MODE_POOL_OWNER__WITHDRAWALS_NOT_ALLOWED)
    })
})
