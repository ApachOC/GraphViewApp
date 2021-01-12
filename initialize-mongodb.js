db.users.drop();
db.users.insert({
    "_id" : "user",
    "password" : "$2a$10$C/yCdT49HGkiy7.A4T3B7OkIe..yXWI/qJYQcU57GBfOgD04h6w/G",
    "email" : "user@example.com",
    "displayName" : "Default User",
    "roles" : ["user"]
});
db.users.insert({
    "_id" : "admin",
    "password" : "$2a$10$8b35le8aFgL.6X5C.d5Tu.ZnmwmjGfmMms6wm68G2.I2BdaGDgRZm",
    "email" : "admin@example.com",
    "displayName" : "Administrator",
    "roles" : ["user", "admin"]
});
// note that this script is only run when /data/db volume is empty
