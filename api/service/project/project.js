import { sendCommand } from "../../../globalFunctions.js"


export const PROJECT_FIELDS = {
    forceQuit: {
        type: 'checkbox',
        label: 'Force Quit',
        id: 'forceQuit',
        default: false
    },
    projectPath: {
        type: 'textinput',
        label: 'Project Path',
        id: 'projectPath',
        default: '',
        regex: '/.*/',
        useVariables: true,
    },
    soloMode: {
        type: 'checkbox',
        label: 'Solo Mode',
        id: 'soloMode',
        default: false
    },
    allowUpgrade: {
        type: 'checkbox',
        label: 'Allow Upgrade',
        id: 'allowUpgrade',
        default: false
    },
}

export const PROJECT_ACTIONS = {
    post_project_quitlocalproject: {
        name: 'Project: Quit Project',
        options: [
            PROJECT_FIELDS.forceQuit,
        ],
        callback: async (action, context, self) => {
            let address = `/api/service/project/quitlocalproject`
            if (action.options.forceQuit) {
                address = `/api/service/project/forcequitlocalproject`
            }
            await sendCommand(self, action, address, {})
        },
    },
    post_project_restartlocalproject: {
        name: 'Project: Restart Local Project',
        callback: async (action, context, self) => {
            const address = `/api/service/project/restartlocalproject`
            await sendCommand(self, action, address, {})
        },
    },
    post_project_startlocalproject: {
        name: 'Project: Start Local Project',
        options: [
            PROJECT_FIELDS.projectPath,
            PROJECT_FIELDS.soloMode,
            PROJECT_FIELDS.allowUpgrade
        ],
        callback: async (action, context, self) => {
            const address = `/api/service/project/startlocalproject`
            let data = {
                projectPath: action.options.projectPath,
                soloMode: action.options.soloMode,
                allowUpgrade: action.options.allowUpgrade
            }
            await sendCommand(self, action, address, data)
        },
    }
}