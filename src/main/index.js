import { app, shell, BrowserWindow, ipcMain, dialog} from 'electron'
import { join } from 'path'
import pg from 'pg'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

async function getPartners() {
  const { Client } = pg;
  const user = 'postgres';
  const password = '1234';
  const host = 'localhost';
  const port = '5432';
  const database = 'postgres';

  const client = new Client({
    user, password, host, port, database
  })
  await client.connect()

  try {
    const response = await client.query(`
    SELECT partners.*,
    company_types.type as company_type_name,
    CASE WHEN sum(purchases.product_quantity) > 300000 THEN 15
    WHEN sum(purchases.product_quantity) > 50000 THEN 10
    WHEN sum(purchases.product_quantity) > 10000 THEN 5
    ELSE 0 
    END as discount
    from partners
    LEFT JOIN purchases on partners.id = purchases.partner_id
    LEFT JOIN company_types ON partners.company_type = company_types.id
    GROUP BY partners.id, company_types.type`)
    return response.rows
  } catch (e) {
    console.log(e)
  }
}


async function createPartner(event, partner) {
  const { Client } = pg;
  const user = 'postgres';
  const password = '1234';
  const host = 'localhost';
  const port = '5432';
  const database = 'postgres';

  const client = new Client({
    user, password, host, port, database
  })
  await client.connect()

  const { type, name, ceo, email, phone, address, rating } = partner;
  try {
    await client.query(`INSERT into partners
    (company_type, name, director, email, phone, address, rating)
    values
    ('${type}', '${name}', '${ceo}', '${email}', '${phone}', '${address}', ${rating})`)

    dialog.showMessageBox({ message: 'Партнер создан' })
  } catch (e) {
    console.log(e)
    dialog.showErrorBox('Ошибка', "Партнер с таким именем уже есть")
  }
}

async function updatePartner(event, partner) {
  const { Client } = pg;
  const user = 'postgres';
  const password = '1234';
  const host = 'localhost';
  const port = '5432';
  const database = 'postgres';

  const client = new Client({
    user, password, host, port, database
  })
  await client.connect()

  const { id, type, name, ceo, email, phone, address, rating } = partner;
  try {
    await client.query(`UPDATE partners
      SET name = '${name}', company_type = '${type}', director='${ceo}', email='${email}', phone='${phone}', address='${address}', rating='${rating}'
      WHERE partners.id = ${id};`)
    dialog.showMessageBox({ message: ' Данные обновлены' })
    return;
  } catch (e) {
    dialog.showErrorBox('Невозможно внести такие изменения', 'Такой пользователь уже есть')
    return ('error')
  }
}


function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    icon: join(__dirname, '../../resources/icon.ico'),
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    devtools: true,
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  ipcMain.handle('getPartners', getPartners)
  ipcMain.handle('createPartner', createPartner)
  ipcMain.handle('updatePartner', updatePartner)
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

