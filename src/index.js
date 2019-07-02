const {app, BrowserWindow, Menu, ipcMain }=require('electron');
const url =require('url');
const path = require ('path');
let mainWindow;
let newPacienteWindow;


/**
 * Funcion que hace que electron se actualize ante cualquier cambio de codigo(no funciona)
 */
if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname,{
        electron: path.join(__dirname, '../node_modules','.bin','electron')
    });
}

/**
 * ipcMain maneja informacion dentro de Electron.
 */
ipcMain.on('paciente:nuevo',(e, enviaInfoNuevoPaciente)=>{
    mainWindow.webContents.send('paciente:nuevo',enviaInfoNuevoPaciente);
    newPacienteWindow.close(true);
})


/**
 * Constante que contiene el array para generar el menu.
 */
const templateMenu=[
    {
        label: 'Pacientes',
        submenu: [
            {
                label: 'Nuevo Paciente',
                accelerator: 'Ctrl+N',
                click(){
                    createNewPacient();
                }
            }
        ]        
    },
    {
        label: 'Dietas',
        accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q'       
    },
    {
        label: 'Turnos'
    }
];

/**
 * Genera funciones de desarrollo (DevTool) en la ventana 
 */

if(process.env.NODE_ENV !== 'production'){
    templateMenu.push({
        label: 'DevTools',
        submenu:[
            {
                label: 'Show/Hide Dev Tools',
                accelerator: 'Ctrl+D',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    })
}

/**
 * Constante que ejecuta funcion asociada con propiedad de electron
 *  para construir el menu desde un templado 
 */
const mainMenu= Menu.buildFromTemplate(templateMenu);

/**
 * Evento que hace que se ejecute la proceso principal de electron 
 */
app.on('ready', ()=>{ 
    /**
     * Variable que se asocia a propiedad de electron,
     * donde se pueden dar valores a los atributos de la ventana.
     */
    mainWindow =new BrowserWindow({
        title: "Nutri & Vida",
        webPreferences:{
            nodeIntegration:true
        }
    });  

    /**
     * Propiedad que une la ventana principal con archivo html
     */
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));
    
    /**
     * Propiedad de electron que se usa para generar el menu.
     */
    Menu.setApplicationMenu(mainMenu);
 
    
    /**
     * Propiedad que cierra todas las ventanas cuando se cierra la venta principal
     */
    mainWindow.on('close',()=>{
        app.quit();
    });
    
});

/**
 * Funcion que crea la ventana Paciente
 */
function createNewPacient(){
    newPacienteWindow= new BrowserWindow({ 
        width: 500,
        heigth: 200,
        title:'Nuevo Paciente',
        webPreferences:{
            nodeIntegration:true
        }
    });

    //newPacienteWindow.setMenu(null);

    newPacienteWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/paciente.html'),
        protocol: 'file',
        slashes: true
    }));

    /**
     * Cierra la ventana Paciente
     */
    newPacienteWindow.on('close',()=>{
        newPacienteWindow=null;
    });
}

