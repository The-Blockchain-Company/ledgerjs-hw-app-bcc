import { expect } from "chai"

import type Bcc from "../../src/Bcc"
import { getBcc } from "../test_utils"

describe("getSerial", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    it("Should correctly get the serial number of the device", async () => {
        const response = await bcc.getSerial()
        expect(response.serial.length).to.equal(14)
    })
})
