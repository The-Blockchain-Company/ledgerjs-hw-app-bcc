import chai, { expect } from "chai"
import chaiAsPromised from "chai-as-promised"

import type { Bcc } from "../../src/Bcc"
import { utils } from "../../src/Bcc"
import { getBcc } from "../test_utils"
import { coleTestcases, InvalidPathTestcases, sophieTestcases } from "./__fixtures__/deriveAddress"

chai.use(chaiAsPromised)


const address_hex_to_base58 = (addressHex: string) => utils.base58_encode(utils.hex_to_buf(addressHex as any))

describe("deriveAddress", async () => {
    let bcc: Bcc = {} as any

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    describe("Should succesfully derive Cole address", async () => {
        for (const { testname, network, addressParams, result: expectedResult } of coleTestcases) {
            it(testname, async () => {
                const { addressHex } = await bcc.deriveAddress({
                    network,
                    address: addressParams,
                })

                expect(address_hex_to_base58(addressHex)).to.equal(expectedResult)
            })
        }
    })

    describe("Should succesfully derive Sophie address", async () => {
        for (const { testname, network, addressParams, result: expectedResult } of sophieTestcases) {
            it(testname, async () => {
                const { addressHex } = await bcc.deriveAddress({ network, address: addressParams })

                expect(utils.bech32_encodeAddress(utils.hex_to_buf(addressHex as any))).to.equal(
                    expectedResult
                )
            })
        }
    }).timeout(60000)

    describe("Should not permit invalid path for derive address", async () => {
        for (const { testname, network, addressParams, errCls, errMsg } of InvalidPathTestcases) {
            it(testname, async () => {
                const promise = bcc.deriveAddress({
                    network,
                    address: addressParams,
                })
                await expect(promise).to.be.rejectedWith(errCls, errMsg)
            })
        }
    })

    describe("Should succesfully show Cole address", async () => {
        for (const { testname, network, addressParams } of coleTestcases) {
            it(testname, async () => {
                const result = await bcc.showAddress({ network, address: addressParams })
                expect(result).to.equal(undefined)
            })
        }
    })

    describe("Should succesfully show Sophie address", async () => {
        for (const { testname, network, addressParams } of sophieTestcases) {
            it(testname, async () => {
                const result = await bcc.showAddress({ network, address: addressParams })
                expect(result).to.equal(undefined)
            })
        }
    }).timeout(60000)

    describe("Should not permit invalid path for show address", async () => {
        for (const { testname, network, addressParams, errCls, errMsg } of InvalidPathTestcases) {
            it(testname, async () => {
                const promise = bcc.showAddress({
                    network,
                    address: addressParams,
                })
                await expect(promise).to.be.rejectedWith(errCls, errMsg)
            })
        }
    })
})
