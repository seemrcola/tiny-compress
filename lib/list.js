import { getApikeys } from '../utils/index.js'

async function getList() {
  const listObj = await getApikeys()

  let result = ''
  const keys = Object.keys(listObj)
  keys.forEach(name => {
    result += `${name} : ${listObj[name]} \n`
  })
  if (!result) result = 'no apikeys, try "add <apikeys> <alias>"'
  console.log(result)
}

export default getList
