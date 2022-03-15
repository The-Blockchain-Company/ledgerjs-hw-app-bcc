import chai, { expect } from "chai"
import chaiAsPromised from "chai-as-promised"

import type { Bcc } from "../../src/Bcc"
import { DeviceStatusError, InvalidData, NativeScriptHashDisplayFormat } from "../../src/Bcc"
import { describeWithoutValidation, getBcc } from "../test_utils"
import { InvalidOnLedgerScriptTestcases, InvalidScriptTestcases, ValidNativeScriptTestcases } from "./__fixtures__/deriveNativeScriptHash"

chai.use(chaiAsPromised)

describe("deriveNativeScriptHash", async () => {
    let bcc: Bcc = {} as any

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    describe("Valid native scripts", async () => {
        for (const { testname, script, displayFormat, hash: expectedHash } of ValidNativeScriptTestcases) {
            it(testname, async () => {
                const { scriptHashHex } = await bcc.deriveNativeScriptHash({
                    script,
                    displayFormat,
                })

                expect(scriptHashHex).to.equal(expectedHash)
            })
        }
    })

    describeWithoutValidation("Ledger should not permit invalid scripts", async () => {
        for (const { testname, script } of InvalidOnLedgerScriptTestcases) {
            it(testname, async () => {
                const promise = bcc.deriveNativeScriptHash({
                    script,
                    displayFormat: NativeScriptHashDisplayFormat.BECH32,
                })
                await expect(promise).to.be.rejectedWith(DeviceStatusError)
            })
        }
    })

    describe("Ledgerjs should not permit invalid scripts", async () => {
        for (const { testname, script, invalidDataReason: expectedInvalidDataReason } of InvalidScriptTestcases) {
            it(testname, async () => {
                const promise = bcc.deriveNativeScriptHash({
                    script,
                    displayFormat: NativeScriptHashDisplayFormat.BECH32,
                })
                await expect(promise).to.be.rejectedWith(InvalidData, expectedInvalidDataReason)
            })
        }
    })
})
