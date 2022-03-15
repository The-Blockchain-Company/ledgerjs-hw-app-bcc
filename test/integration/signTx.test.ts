import { expect } from "chai"

import type Ada from "../../src/Ada"
import { describeWithoutValidation,getAda } from "../test_utils"
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
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const { testname, tx, signingMode, result: expected } of testsCole) {
        it(testname, async () => {
            const response = await ada.signTransaction({
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
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const { testname, tx, signingMode, additionalWitnessPaths, result: expected } of testsSophieNoCertificates) {
        it(testname, async () => {
            const response = await ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths,
            })
            expect(response).to.deep.equal(expected)
        })
    }
})

describe("signTxOrdinarySophieWithCertificates", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const { testname, tx, signingMode, additionalWitnessPaths, result: expected } of testsSophieWithCertificates) {
        it(testname, async () => {
            const response = await ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths,
            })
            expect(response).to.deep.equal(expected)
        })
    }
})

describe("signTxSophieRejectsJS", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const {testname, tx, signingMode, rejectReason } of testsSophieRejects) {
        it(testname, async() => {
            const response = ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            await expect(response).to.be.rejectedWith(rejectReason)
        })
    }
})

describeWithoutValidation("signTxSophieRejectsLedger", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const {testname, tx, signingMode, errCls, errMsg } of testsSophieRejects) {
        it(testname, async() => {
            const response = ada.signTransaction({
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
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const { testname, tx, signingMode, result: expected } of testsEvie) {
        it(testname, async () => {
            const response = await ada.signTransaction({
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
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const { testname, tx, signingMode, result: expected } of testsMary) {
        it(testname, async () => {
            const response = await ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            expect(response).to.deep.equal(expected)
        })
    }

    for (const { testname, tx, signingMode, result: expected } of testsCatalystRegistration) {
        it(testname, async () => {
            const response = await ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            expect(response).to.deep.equal(expected)
        })
    }

    for (const {testname, tx, signingMode, rejectReason } of testsInvalidTokenBundleOrdering) {
        it(testname, async() => {
            const response = ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            await expect(response).to.be.rejectedWith(rejectReason)
        })
    }
})

describeWithoutValidation("signTxOrdinaryMaryRejects", async () => {
    let ada: Ada = {} as Ada

    beforeEach(async () => {
        ada = await getAda()
    })

    afterEach(async () => {
        await (ada as any).t.close()
    })

    for (const {testname, tx, signingMode, errCls, errMsg } of testsInvalidTokenBundleOrdering) {
        it(testname, async() => {
            const response = ada.signTransaction({
                tx,
                signingMode,
                additionalWitnessPaths: [],
            })
            await expect(response).to.be.rejectedWith(errCls, errMsg)
        })
    }
})
