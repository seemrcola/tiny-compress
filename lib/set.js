import { writeFile, getApikeys } from '../utils/index.js'
import { COMPRESSRC } from '../config/index.js'

async function addApikey(apikey, apikeyAlias) {
    if (!apikey || !apikeyAlias)
        return console.log(`<apikey> <apikeyAlias> can not be undefined`)

    const customApis = await getApikeys()
    const api = {
        [apikeyAlias]: apikey
    }
    const rcObject = { ...api, ...customApis }
    writeFile(COMPRESSRC, rcObject)
}

export default addApikey
