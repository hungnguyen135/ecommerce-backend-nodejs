const mysql = require('mysql2')

// create connection to pool server
const pool = mysql.createPool({
    host: 'localhost',
    user: 'tuitenhung',
    password: 'hung135',
    database: 'shopDev',
})

const batchSize = 100000; // adjust batch size
const totalSize = 10_000_000; // adjust total size 
let currentId = 1;

console.time(':::::::TIMMER::')
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const age = currentId
        const address = `address-${currentId}`
        values.push([currentId, name, age, address]);
        currentId++;
    }

    if (!values.length) {
        console.timeEnd(':::::::TIMMER::')
        pool.end(err => {
            if (err) {
                console.log(`Error occurred while running batch`)
            } else {
                console.log(`Connection pool closed successfully`)
            }
        })
        return;
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`
    pool.query(sql, [values], async function (err, result) {
        if (err) throw err

        console.log(`Insert ${result.affectedRows} records`)

        await insertBatch()
    })
}

insertBatch().catch(console.error)


// // perform a sample operation
// pool.query('SELECT * FROM users', function (err, result) {
//     if (err) throw err

//     console.log(`query result: `, result)

//     // close pool connection
//     pool.end(err => {
//         if (err) throw err
//         console.log(`connection closed.`)
//     })
// })