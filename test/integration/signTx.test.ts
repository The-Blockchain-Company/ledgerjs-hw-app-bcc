import { expect } from "chai"

import type Bcc from "../../src/Bcc"
import { describeWithoutValidation,getBcc } from "../test_utils"
import {
    testsEvie,
    testsCole,
    testsCatalystRegistration,
    testsInvalidTokenBundleOrdering,
    testsMary,
    testsSophieNoCertificates,
    testsSophieRejects,
    testsSophieWithCertificates,
} from "./__fixtures__/signTx"

// ========================================   COLE   ========================================



// Sophie transaction format, but includes legacy Cole addresses in outputs
describe("signTxOrdinaryCole", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    for (const { testname, tx, signingMode, result: expected } of testsCole) {
        it(testname, async () => {
            const response = await bcc.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            expect(response).to.deep.equal(expected)
        })
    }
})

// ========================================   SOPHIE   ========================================

describe("signTxOrdinarySophieNoCertificates", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    for (const { testname, tx, signingMode, additionalWitnessPaths, result: expected } of testsSophieNoCertificates) {
        it(testname, async () => {
            const response = await bcc.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths,
            })
            expect(response).to.deep.equal(expected)
        })
    }
})

describe("signTxOrdinarySophieWithCertificates", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    for (const { testname, tx, signingMode, additionalWitnessPaths, result: expected } of testsSophieWithCertificates) {
        it(testname, async () => {
            const response = await bcc.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths,
            })
            expect(response).to.deep.equal(expected)
        })
    }
})

describe("signTxSophieRejectsJS", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    for (const {testname, tx, signingMode, rejectReason } of testsSophieRejects) {
        it(testname, async() => {
            const response = bcc.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            await expect(response).to.be.rejectedWith(rejectReason)
        })
    }
})

describeWithoutValidation("signTxSophieRejectsLedger", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    for (const {testname, tx, signingMode, errCls, errMsg } of testsSophieRejects) {
        it(testname, async() => {
            const response = bcc.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            await expect(response).to.be.rejectedWith(errCls, errMsg)
        })
    }
})


// ========================================   EVIE   ========================================

// changes:
// ttl optional
// added validity_interval_start

describe("signTxOrdinaryEvie", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    for (const { testname, tx, signingMode, result: expected } of testsEvie) {
        it(testname, async () => {
            const response = await bcc.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            expect(response).to.deep.equal(expected)
        })
    }
})

// ========================================   JEN   ========================================

// changes:
// multiassets in outputs

describe("signTxOrdinaryMary", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    for (const { testname, tx, signingMode, result: expected } of testsMary) {
        it(testname, async () => {
            const response = await bcc.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            expect(response).to.deep.equal(expected)
        })
    }

    for (const { testname, tx, signingMode, result: expected } of testsCatalystRegistration) {
        it(testname, async () => {
            const response = await bcc.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            expect(response).to.deep.equal(expected)
        })
    }

    for (const {testname, tx, signingMode, rejectReason } of testsInvalidTokenBundleOrdering) {
        it(testname, async() => {
            const response = bcc.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            await expect(response).to.be.rejectedWith(rejectReason)
        })
    }
})

describeWithoutValidation("signTxOrdinaryMaryRejects", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    for (const {testname, tx, signingMode, errCls, errMsg } of testsInvalidTokenBundleOrdering) {
        it(testname, async() => {
            const response = bcc.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            await expect(response).to.be.rejectedWith(errCls, errMsg)
        })
    }
})
