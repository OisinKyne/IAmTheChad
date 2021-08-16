// @ts-nocheck
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require(`path`)
const fetch = require(`node-fetch`)
var ethers = require('ethers');

// Helper function to timeout the fetch api if the backend is down such that the request hangs
function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject({
        json: async () => {
          return Promise.resolve([])
        },
      })
    }, ms)
    promise.then(
      res => {
        clearTimeout(timeoutId)
        resolve(res)
      },
      err => {
        clearTimeout(timeoutId)
        reject(err)
      }
    )
  })
}

// Grab hall of fame + basefee + tokenURI from IAmTheChad contract at build time. 
exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
}) => {
  // get reownBasefee
  const result = await fetch(`https://mainnet.infura.io/v3/339520a08e3446cc8bf2f008d7de8339`,{
    method: 'POST',
    headers: { 'Content-Type':'application/json'},
    body: JSON.stringify({"jsonrpc":"2.0","id":6,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":"0xc21ac9a50000000000000000000000000000000000000000000000000000000000000000","to":"0x621a6d60c7c16a1ac9bba9cc61464a16b43cac51"},"latest"]})
  })
  const resultData = await result.json()

  if(!!resultData.result){
    
    // convert a wei hex value to uint gwei. 
    const wei = parseInt(resultData.result, 16)
    console.log(`Current reown value is ${wei.toString()} wei.`)
    const gwei = wei / 1000000000.0
    console.log(`Current reown value is ${gwei.toString()} gwei.`)

    // Save this data to the Gatsby Graph for later use in static site construction
    createNode({
      wei: wei,
      gwei: gwei,
      // required fields
      id: `basefee`,
      parent: null,
      children: [],
      internal: {
        type: `Basefee`,
        contentDigest: createContentDigest(resultData),
      },
    })
  }

  // Now lets loop through the hallOfFame address list until a request fails/reverts on us. 
  let shouldBreak = false;
  let fameIndex = 0
  const hallOfFamers = []
  const hallOfFamersENS = []
  // Use CloudFlare Provider to reverse resolve for ENS name
  var provider = new ethers.providers.CloudflareProvider();
  while(!shouldBreak){
    // console.log(`Searching hallOfFame array at index ${fameIndex}`)
    const result = await fetch(`https://mainnet.infura.io/v3/339520a08e3446cc8bf2f008d7de8339`,{
      method: 'POST',
      headers: { 'Content-Type':'application/json'},
      body: JSON.stringify({"jsonrpc":"2.0","id":6,"method":"eth_call","params":[{"from":"0x0000000000000000000000000000000000000000","data":`0x41fcb7d7000000000000000000000000000000000000000000000000000000000000000${fameIndex}`,"to":"0x621a6d60c7c16a1ac9bba9cc61464a16b43cac51"},"latest"]})
    })
    const resultData = await result.json()
    
    if(!!resultData.result){
      // console.log(`Retrieved another hall of famer address:  ${resultData.result}`)
      const address = `0x`+resultData.result.substring(resultData.result.length-40, resultData.result.length)
      // console.log(`\n\nAddress: ${address}`)
      hallOfFamers.push(address)
      const name = await provider.lookupAddress(address);
      // console.log(`\n\nNane: ${name}`)
      hallOfFamersENS.push(name)
    } else {
      // console.log(`Failed to get a result from the hall of fame API call, exiting loop`)
      shouldBreak = true
    }
    fameIndex += 1
  }
  // Push the hall of fame to the gatsby graph
  createNode({
    hallOfFamers: hallOfFamers,
    hallOfFamersENS: hallOfFamersENS,
    // required fields
    id: `hallOfFamers`,
    parent: null,
    children: [],
    internal: {
      type: `HOF`,
      contentDigest: createContentDigest(resultData),
    },
  })
  console.log(`The following hall of famers were found: ${hallOfFamers}`)

}