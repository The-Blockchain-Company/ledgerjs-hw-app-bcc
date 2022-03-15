import chai, { expect } from "chai"
import chaiAsPromised from 'chai-as-promised'

import type Bcc from "../../src/Bcc"
import { DeviceStatusError } from "../../src/Bcc"
import { str_to_path } from "../../src/utils/address"
import { getBcc } from "../test_utils"
import type { TestCase } from "./__fixtures__/getExtendedPublicKey"
import { testsCole, testsColdKeys, testsSophie, testsSophieUnusual } from "./__fixtures__/getExtendedPublicKey"
chai.use(chaiAsPromised)

describe("getExtendedPublicKey", async () => {
    let bcc: Bcc = {} as Bcc

    beforeEach(async () => {
        bcc = await getBcc()
    })

    afterEach(async () => {
        await (bcc as any).t.close()
    })

    describe("Should successfully get a single extended public key", async () => {
        const test = async (tests: TestCase[]) => {
            for (const { path, expected } of tests) {
                const response = await bcc.getExtendedPublicKey(
                    { path: str_to_path(path) }
                )

                expect(response.publicKeyHex).to.equal(expected.publicKey)
                expect(response.chainCodeHex).to.equal(expected.chainCode)
            }
        }

        it('cole', async () => {
            await test(testsCole)
        })
        it('sophie', async () => {
            await test(testsSophie)
        })
        it('sophie unusual', async () => {
            await test(testsSophieUnusual)
        })
        it('cold keys', async () => {
            await test(testsColdKeys)
        })
    })

    describe("Should successfully get several extended public keys", async () => {
        const test = async (tests: TestCase[]) => {
            const results = await bcc.getExtendedPublicKeys(
                { paths: tests.map(({ path }) => str_to_path(path)) }
            )

            expect(results.length).to.equal(tests.length)
            for (let i = 0; i < tests.length; i++) {
                expect(results[i].publicKeyHex).to.equal(tests[i].expected.publicKey)
                expect(results[i].chainCodeHex).to.equal(tests[i].expected.chainCode)
            }
        }

        it('starting with a usual one', async () => {
            await test([...testsCole, ...testsSophie, ...testsColdKeys])
        })

        it('starting with an unusual one', async () => {
            await test([...testsSophieUnusual, ...testsCole, ...testsColdKeys, ...testsSophie])
        })
    })

    describe("Should reject invalid paths", () => {
        it('path shorter than 3 indexes', async () => {
            const promise = bcc.getExtendedPublicKey({ path: str_to_path("44'/1815'") })
            await expect(promise).to.be.rejectedWith(DeviceStatusError, "Action rejected by Ledger's security policy")
        })

        it('path not matching cold key structure', async () => {
            const promise = bcc.getExtendedPublicKey({ path: str_to_path("1853'/1900'/0'/0/0") })
            await expect(promise).to.be.rejectedWith(DeviceStatusError, "Action rejected by Ledger's security policy")
        })
    })
})
