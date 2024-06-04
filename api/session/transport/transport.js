import { sendCommand, getRequest } from '../../../globalFunctions.js'
import { InstanceStatus } from '@companion-module/base'
import { TRANSPORT_FIELDS } from './transportFields.js'
import { PLAY_MODES, TRANSPORT_COMMANDS } from './transportConstants.js';

/* -------------------------------------------------------------------------- */
/*                                  FUNCTIONS                                 */
/* -------------------------------------------------------------------------- */

function createTransportJSON(JSON) {
    const transport = { "name": JSON.transportName };
    const json = { "transports": [{ "transport": transport }] };

    if (JSON.type !== undefined) {
        json.transports[0].type = JSON.type;
    }
    if (JSON.value !== undefined) {
        json.transports[0].value = JSON.value;
    }
    if (JSON.time !== undefined) {
        json.transports[0].time = JSON.time;
    }
    if (JSON.frame !== undefined) {
        json.transports[0].frame = JSON.frame;
    }
    if (JSON.section !== undefined) {
        json.transports[0].section = JSON.section;
    }
    if (JSON.allowGlobalJump !== undefined) {
        json.transports[0].allowGlobalJump = JSON.allowGlobalJump;
    }
    if (JSON.playmode !== undefined) {
        json.transports[0].playmode = JSON.playmode;
    }
    if (JSON.note !== undefined) {
        json.transports[0].note = JSON.note;
    }
    if (JSON.timecode !== undefined) {
        json.transports[0].timecode = JSON.timecode;
    }
    if (JSON.ignoreTags !== undefined) {
        json.transports[0].ignoreTags = JSON.ignoreTags;
    }

    return json;
}


/* -------------------------------------------------------------------------- */
/*                                   ACTIONS                                  */
/* -------------------------------------------------------------------------- */

export const TRANSPORT_ACTIONS = {

    post_transport_brightness: {
        name: 'Transport: Brightness',
        options: [
            TRANSPORT_FIELDS.TargetTransport,
            TRANSPORT_FIELDS.Brightness,
        ],
        callback: async (action, context, self) => {
            let address = `/api/session/transport/brightness`
            let data = {
                transports: [
                    {
                        name: action.options.player,
                        brightness: action.options.brightness
                    }
                ]
            }
            await sendCommand(self, action, address, data)
        },
    },

    post_transport_volume: {
        name: 'Transport: Volume',
        options: [
            TRANSPORT_FIELDS.TargetTransport,
            TRANSPORT_FIELDS.Volume,
        ],
        callback: async (action, context, self) => {
            let address = `/api/session/transport/volume`
            let data = {
                transports: [
                    {
                        name: action.options.player,
                        volume: action.options.volume
                    }
                ]
            }
            await sendCommand(self, action, address, data)
        },
    },

    post_transport_engaged: {
        name: 'Transport: Engage / Disengage',
        options: [
            TRANSPORT_FIELDS.TargetTransport,
            TRANSPORT_FIELDS.Engaged,
        ],
        callback: async (action, context, self) => {
            let address = `/api/session/transport/engaged`
            let data = {
                transports: [
                    {
                        name: action.options.player,
                        engaged: action.options.engaged
                    }
                ]
            }
            await sendCommand(self, action, address, data)
        },
    },

    post_transport_command: {
        name: 'Transport: Command',
        options: [
            TRANSPORT_FIELDS.TargetTransport,
            TRANSPORT_FIELDS.TransportCommand,
        ],
        callback: async (action, context, self) => {
            let address = `/api/session/transport`
            let data = {
                transports: [
                    {
                        name: action.options.player,
                    }
                ]
            }
            self.log('error', action.options.command)
            switch (action.options.command) {
                case TRANSPORT_COMMANDS[0].id:
                    address = `${address}/gotonextsection`
                    break
                case TRANSPORT_COMMANDS[1].id:
                    address = `${address}/gotonexttrack`
                    break
                case TRANSPORT_COMMANDS[2].id:
                    address = `${address}/gotoprevsection`
                    break
                case TRANSPORT_COMMANDS[3].id:
                    address = `${address}/gotoprevtrack`
                    break
                case TRANSPORT_COMMANDS[4].id:
                    address = `${address}/returntostart`
                    break
                default:
                    self.log('error', `Invalid command ${action.options.command}`)
                    self.updateStatus(InstanceStatus.UnknownError, `Invalid command ${action.options.command}`)
                    return
            }

            await sendCommand(self, action, address, data)
        },
    },

    post_transport_playmode: {
        name: 'Transport: PlayMode',
        options: [
            TRANSPORT_FIELDS.TargetTransport,
            TRANSPORT_FIELDS.PlayMode,
        ],
        callback: async (action, context, self) => {
            let address = `/api/session/transport`
            let data = {
                transports: [
                    {
                        name: action.options.player
                    }
                ]
            }
            switch (action.options.playmode) {
                case PLAY_MODES[0].id:
                    address = `${address}/play`
                    break
                case PLAY_MODES[1].id:
                    address = `${address}/playsection`
                    break
                case PLAY_MODES[2].id:
                    address = `${address}/playloopsection`
                    break
                case PLAY_MODES[3].id:
                    address = `${address}/stop`
                    break
                default:
                    self.log('error', `Invalid playMode ${action.options.playmode}`)
                    self.updateStatus(InstanceStatus.UnknownError, `Invalid playMode ${action.options.playmode}`)
                    return
            }
            await sendCommand(self, action, address, data)
        },
    },

    post_transport_gotocue: {
        name: 'Transport: Go To',
        options: [
            TRANSPORT_FIELDS.TargetTransport,
            TRANSPORT_FIELDS.PlayMode,
            TRANSPORT_FIELDS.GoToCueType,
            TRANSPORT_FIELDS.TAG_GoToTagType,
            TRANSPORT_FIELDS.TAG_AllowGlobalJump,
            TRANSPORT_FIELDS.TIME_GoToTimeType,
            TRANSPORT_FIELDS.TC_IgnoreTag,
            TRANSPORT_FIELDS.CUE_GoToTarget,
            TRANSPORT_FIELDS.MIDI_GoToTarget,
            TRANSPORT_FIELDS.NOTE_GoToTarget,
            TRANSPORT_FIELDS.TC_GoToTarget,
            TRANSPORT_FIELDS.TIME_GoToTarget,
            TRANSPORT_FIELDS.FRAME_GoToTarget,
            TRANSPORT_FIELDS.SECTION_GoToTarget,
            TRANSPORT_FIELDS.TRACK_GoToTarget,
        ],
        callback: async (action, context, self) => {
            //SET INITIAL ADDRESS
            let address = `/api/session/transport`
            //SET INITIAL JSON OBJECT FOR KNOWN FIELDS - TRANSPORT NAME
            let json = { transportName: action.options.player }
            //PARSE THROUGH USER OPTIONS
            switch (action.options.cueType) {
                case 'gototag':
                    address = `${address}/gototag`
                    json.type = action.options.tagType
                    json.allowGlobalJump = action.options.allowGlobalJump
                    switch (action.options.tagType) {
                        case 'CUE':
                            json.value = action.options.cueTarget
                            break
                        case 'MIDI':
                            json.value = action.options.midiTarget
                            break
                        case 'TC':
                            json.value = action.options.timecodeTarget
                            break
                        default:
                            self.log('error', `Invalid tagType ${action.options.tagType}`)
                            self.updateStatus(InstanceStatus.UnknownError, `Invalid tagType ${action.options.tagType}`)
                            return
                    }       
                    break
                case 'gotonote':
                    address = `${address}/gotonote`
                    json.note = action.options.noteTarget
                    break
                case 'gotosection':
                    address = `${address}/gotosection`
                    json.section = action.options.sectionTarget
                    break
                case 'gototime':
                    switch (action.options.timeType) {
                        case 'timecode':
                            address = `${address}/gototimecode`
                            json.timecode = action.options.timecodeTarget
                            json.ignoreTags = action.options.ignoreTags
                            break
                        case 'seconds':
                            address = `${address}/gototime`
                            json.time = action.options.timeTarget
                            break
                        case 'frame':
                            address = `${address}/gotoframe`
                            json.frame = action.options.frameTarget
                            break
                        default:
                            self.log('error', `Invalid timeType ${action.options.timeType}`)
                            self.updateStatus(InstanceStatus.UnknownError, `Invalid timeType ${action.options.timeType}`)
                            return
                    }
                    break;
                default:
                    self.log('error', `Invalid cueType ${action.options.cueType}`)
                    self.updateStatus(InstanceStatus.UnknownError, `Invalid cueType ${action.options.cueType}`)
                    return
            }
            // CONVERT PLAYMODE TO INTEGER
            let playmodeInt = 0
            switch (action.options.playmode) {
                case PLAY_MODES[0].id:
                    playmodeInt = 1
                    break
                case PLAY_MODES[1].id:
                    playmodeInt = 2
                    break
                case PLAY_MODES[2].id:
                    playmodeInt = 3
                    break
                case PLAY_MODES[3].id:
                    playmodeInt = 4
                    break
                default:
                    self.log('error', `Invalid playMode ${action.options.playmode}`)
                    self.updateStatus(InstanceStatus.UnknownError, `Invalid playMode ${action.options.playmode}`)
                    return
            }

            json.playmode = playmodeInt
            await sendCommand(self, action, address, createTransportJSON(json))
        }
    },
}
/* -------------------------------------------------------------------------- */
/*                                  VARIABLES                                 */
/* -------------------------------------------------------------------------- */

export async function fetchTransportVariableDefinitions(self) {
    const activeTransportData = await getRequest(`http://${self.config.ipaddress}/api/session/transport/activetransport`)
    const transports = activeTransportData.result
    const variableDefinitions = []

    transports.forEach((transport, index) => {
        const transportIndex = index + 1
        variableDefinitions.push(
            { variableId: `transport${transportIndex}_name`, name: `Transport ${transportIndex} Name` },
            { variableId: `transport${transportIndex}_engaged`, name: `Transport ${transportIndex} Engaged` },
            { variableId: `transport${transportIndex}_volume`, name: `Transport ${transportIndex} Volume` },
            { variableId: `transport${transportIndex}_brightness`, name: `Transport ${transportIndex} Brightness` },
            { variableId: `transport${transportIndex}_playmode`, name: `Transport ${transportIndex} Play Mode` },
            { variableId: `transport${transportIndex}_currentTrack`, name: `Transport ${transportIndex} Current Track` },
            { variableId: `transport${transportIndex}_receivingTimecode`, name: `Transport ${transportIndex} Receiving Timecode` }
        )
    })

    return variableDefinitions
}

export async function fetchTransportVariableValues(self) {
    const activeTransportData = await getRequest(`http://${self.config.ipaddress}/api/session/transport/activetransport`)
    const transports = activeTransportData.result
    const variableValues = {}

    transports.forEach((transport, index) => {
        const transportIndex = index + 1
        variableValues[`transport${transportIndex}_name`] = transport.name
        variableValues[`transport${transportIndex}_engaged`] = transport.engaged
        variableValues[`transport${transportIndex}_volume`] = transport.volume
        variableValues[`transport${transportIndex}_brightness`] = transport.brightness
        variableValues[`transport${transportIndex}_playmode`] = transport.playmode
        variableValues[`transport${transportIndex}_currentTrack`] = transport.currentTrack ? transport.currentTrack.name : 'N/A'
        variableValues[`transport${transportIndex}_receivingTimecode`] = transport.receivingTimecode
    })

    return variableValues
}