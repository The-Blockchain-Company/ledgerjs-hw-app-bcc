import chai, { expect } from "chai"
import chaiAsPromised from "chai-as-promised"

import type Bcc from "../../src/Bcc"
import { getBcc } from "../test_utils"
import { tests } from "./__fixtures__/signOperationalCertificate"
chai.use(chaiAsPromised)

describe("signOperationalCertificate", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    for (const { testname, operationalCertificate, expected } of tests) {
        it(testname, async () => {
            const response = await bcc.signOperationalCertificate(operationalCertificate)

            expect(response).to.deep.equal(expected)
        })
    }
})
