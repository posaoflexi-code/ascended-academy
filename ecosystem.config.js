module.exports = {
    apps: [{
        name: "ascended-academy",
        script: "./server.js",
        env: {
            PORT: 5005,
            NODE_ENV: "production",
        }
    }]
}
