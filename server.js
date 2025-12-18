const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5005;
const basePath = '/asc_academy';

// Serve static files from the current directory under the base path
app.use(basePath, express.static(path.join(__dirname, '.')));

// Redirect root to base path (optional, for convenience)
app.get('/', (req, res) => {
    res.redirect(basePath);
});

// Fallback to index.html for any other route under base path (SPA support)
app.use(basePath, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 for anything else
app.use((req, res) => {
    res.status(404).send('Not Found. Did you mean <a href="' + basePath + '">' + basePath + '</a>?');
});

app.listen(port, () => {
    console.log(`Ascended Academy Server running on port ${port}`);
    console.log(`Access at http://localhost:${port}${basePath}`);
});
