const fs = require('fs')
const readline = require('readline')
const pool = require('./src/createTables')

const processFile = async () => {
  const fileStream = fs.createReadStream('data/RC_2007-10')
  let promises = []
  let count = 0
  let lineCount = 0

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  console.time('time')

  rl.on('line', async (line) => {
    lineCount++
    const data = JSON.parse(line)
    promises.push(data)

    if (promises.length === 8000) {
      rl.pause()

      promises = promises.flatMap(data => [
        saveToDB('subreddit', data),
        saveToDB('content', data),
        saveToDB('comments', data)
      ])

      Promise.all(promises).then(() => {
        console.log(count++)
        promises = []
        rl.resume()
      })
    }
  }).on('close', () => {
    console.log(`File processed. ${lineCount} lines read `)
    console.timeEnd('time')
    process.exit(0)
  })
}

const saveToDB = async (tableName, data) => {
  let obj = {}
  switch (tableName) {
    case 'subreddit':
      obj = { sub_id: data.subreddit_id, sub_name: data.subreddit }
      break

    case 'content':
      obj = { name: data.name, author: data.author, body: data.body, score: data.score }
      break

    case 'comments':
      obj = { id: data.id, parent_id: data.parent_id, link_id: data.link_id, name: data.name, created: new Date(parseInt(data.created_utc) * 1000), sub_id: data.subreddit_id }
      break
  }

  return pool.query(`INSERT IGNORE INTO ${tableName} SET ?`, obj, (err) => {
    if (err) console.log('Error', err)
  })
}

processFile()
