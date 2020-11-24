let error = true

let res = [

    db.graph_app.drop(),
    db.graph_app.createIndex({ myfield: 1 }, { unique: true }),
    db.graph_app.createIndex({ thatfield: 1 }),
    db.graph_app.createIndex({ thatfield: 1 }),
    db.graph_app.insert({ myfield: 'hello', thatfield: 'testing' }),
    db.graph_app.insert({ myfield: 'hello2', thatfield: 'testing' }),
    db.graph_app.insert({ myfield: 'hello3', thatfield: 'testing' }),
    db.graph_app.insert({ myfield: 'hello3', thatfield: 'testing' })
]

printjson(res)

if (error) {
    print('Error, exiting')
    quit(1)
}
