import type Bcc from "../../src/Bcc"
import { getBcc } from "../test_utils"

describe("runTestsDevice", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    it("Should run device tests", async () => {
        await bcc.runTests()
    })
})
