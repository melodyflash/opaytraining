const electron = require('electron')
console.log('Electron type:', typeof electron)
console.log('Electron:', electron)

if (typeof electron === 'object' && electron.app) {
    const { app, BrowserWindow } = electron
    
    app.whenReady().then(() => {
        const win = new BrowserWindow({ width: 800, height: 600 })
        win.loadFile('app.html')
    })
    
    app.on('window-all-closed', () => {
        app.quit()
    })
} else {
    console.error('Electron not properly loaded!')
}
