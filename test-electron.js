console.log('Testing Electron require...');
try {
    const electron = require('electron');
    console.log('Electron object:', typeof electron);
    console.log('Has app?:', typeof electron.app);
    const { app } = electron;
    console.log('App:', typeof app);
} catch (e) {
    console.error('Error:', e.message);
}
