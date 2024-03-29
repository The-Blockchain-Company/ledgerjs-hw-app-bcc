import { DeviceVersionUnsupported } from "../errors"
import type { DeviceCompatibility, Version } from "../types/internal"
import { INS } from "./common/ins"
import type { Interaction, SendParams } from "./common/types"

const send = (params: {
  p1: number,
  p2: number,
  data: Buffer,
  expectedResponseLength?: number
}): SendParams => ({ ins: INS.GET_VERSION, ...params })


export function* getVersion(): Interaction<Version> {
    // moving getVersion() logic to private function in order
    // to disable concurrent execution protection done by this.transport.decorateAppAPIMethods()
    // when invoked from within other calls to check app version

    const P1_UNUSED = 0x00
    const P2_UNUSED = 0x00
    const response = yield send({
        p1: P1_UNUSED,
        p2: P2_UNUSED,
        data: Buffer.alloc(0),
        expectedResponseLength: 4,
    })
    const [major, sentry, patch, flags_value] = response

    const FLAG_IS_DEBUG = 1
    //const FLAG_IS_HEADLESS = 2;

    const flags = {
        isDebug: (flags_value & FLAG_IS_DEBUG) === FLAG_IS_DEBUG,
    }
    return { major, sentry, patch, flags }
}

export function getCompatibility(version: Version): DeviceCompatibility {
    // We restrict forward compatibility only to backward-compatible semver changes
    const v2_2 = isLedgerAppVersionAtLeast(version, 2, 2) && isLedgerAppVersionAtMost(version, 3, Infinity)
    const v2_3 = isLedgerAppVersionAtLeast(version, 2, 3) && isLedgerAppVersionAtMost(version, 3, Infinity)
    const v2_4 = isLedgerAppVersionAtLeast(version, 2, 4) && isLedgerAppVersionAtMost(version, 3, Infinity)
    const v3_0 = isLedgerAppVersionAtLeast(version, 3, 0) && isLedgerAppVersionAtMost(version, 3, Infinity)

    return {
        isCompatible: v2_2,
        recommendedVersion: v2_2 ? null : '3.0',
        supportsJen: v2_2,
        supportsCatalystRegistration: v2_3,
        supportsZeroTtl: v2_3,
        supportsPoolRegistrationAsOperator: v2_4,
        supportsPoolRetirement: v2_4,
        supportsNativeScriptHashDerivation: v3_0,
        supportsMultisigTransaction: v3_0,
        supportsMint: v3_0,
    }
}

export function isLedgerAppVersionAtLeast(
    version: Version,
    minMajor: number,
    minSentry: number
): boolean {
    const { major, sentry } = version

    return major > minMajor || (major === minMajor && sentry >= minSentry)
}

export function isLedgerAppVersionAtMost(
    version: Version,
    maxMajor: number,
    maxSentry: number
): boolean {
    const { major, sentry } = version

    return major < maxMajor || (major === maxMajor && sentry <= maxSentry)
}

export function ensureLedgerAppVersionCompatible(
    version: Version,
): void {
    const { isCompatible, recommendedVersion } = getCompatibility(version)

    if (!isCompatible) {
        throw new DeviceVersionUnsupported(`Device app version unsupported. Please upgrade to ${recommendedVersion}.`)
    }
}
