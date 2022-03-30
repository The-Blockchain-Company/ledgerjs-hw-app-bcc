import { expect } from "chai"

import type Bcc from "../../src/Bcc"
import { getBcc } from "../test_utils"

describe("getVersion", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    it("Should correctly get the semantic version of device", async () => {
        const { version, compatibility } = await bcc.getVersion()

        expect(version.major).to.equal(3)
        expect(version.sentry).to.equal(0)
        expect(compatibility).to.deep.equal({
            isCompatible: true,
            recommendedVersion: null,
            supportsJen: true,
            supportsMint: true,
            supportsMultisigTransaction: true,
            supportsCatalystRegistration: true,
            supportsZeroTtl: true,
            supportsPoolRegistrationAsOperator: true,
            supportsPoolRetirement: true,
            supportsNativeScriptHashDerivation: true,
        })
    })
})
