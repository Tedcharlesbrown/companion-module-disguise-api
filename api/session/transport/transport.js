import { sendCommand, getRequest } from '../../../globalFunctions.js'
import { InstanceStatus } from '@companion-module/base'
import { TRANSPORT_FIELDS } from './transportFields.js'
import { PLAY_MODES, TRANSPORT_COMMANDS } from './transportConstants.js';
import { getActionDefinitions } from '../../../actions.js'

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
            // Resolve Companion variables before using them
            const cueType = action.options.cueType;
            const tagType = action.options.tagType;
            const allowGlobalJump = action.options.allowGlobalJump;
            const ignoreTags = action.options.ignoreTags;
            const timeType = action.options.timeType;
            const playmode = action.options.playmode;
            const player = await self.parseVariablesInString(action.options.player);
            const cueTarget = await self.parseVariablesInString(action.options.cueTarget);
            const midiTarget = await self.parseVariablesInString(action.options.midiTarget);
            const timecodeTarget = await self.parseVariablesInString(action.options.timecodeTarget);
            const noteTarget = await self.parseVariablesInString(action.options.noteTarget);
            const sectionTarget = await self.parseVariablesInString(action.options.sectionTarget);
            const timeTarget = await self.parseVariablesInString(action.options.timeTarget);
            const frameTarget = await self.parseVariablesInString(action.options.frameTarget);
    
            // Set initial address
            let address = `/api/session/transport`;
            let json = { transportName: player };
    
            // Parse through user options
            switch (cueType) {
                case 'gototag':
                    address = `${address}/gototag`;
                    json.type = tagType;
                    json.allowGlobalJump = allowGlobalJump;
                    switch (tagType) {
                        case 'CUE':
                            json.value = cueTarget;
                            break;
                        case 'MIDI':
                            json.value = midiTarget;
                            break;
                        case 'TC':
                            json.value = timecodeTarget;
                            break;
                        default:
                            self.log('error', `Invalid tagType ${tagType}`);
                            self.updateStatus(InstanceStatus.UnknownError, `Invalid tagType ${tagType}`);
                            return;
                    }
                    break;
                case 'gotonote':
                    address = `${address}/gotonote`;
                    json.note = noteTarget;
                    break;
                case 'gotosection':
                    address = `${address}/gotosection`;
                    json.section = sectionTarget;
                    break;
                case 'gototime':
                    switch (timeType) {
                        case 'timecode':
                            address = `${address}/gototimecode`;
                            json.timecode = timecodeTarget;
                            json.ignoreTags = ignoreTags;
                            break;
                        case 'seconds':
                            address = `${address}/gototime`;
                            json.time = timeTarget;
                            break;
                        case 'frame':
                            address = `${address}/gotoframe`;
                            json.frame = frameTarget;
                            break;
                        default:
                            self.log('error', `Invalid timeType ${timeType}`);
                            self.updateStatus(InstanceStatus.UnknownError, `Invalid timeType ${timeType}`);
                            return;
                    }
                    break;
                default:
                    self.log('error', `Invalid cueType ${cueType}`);
                    self.updateStatus(InstanceStatus.UnknownError, `Invalid cueType ${cueType}`);
                    return;
            }
    
            // Convert playmode to integer
            let playmodeInt = 0;
            switch (playmode) {
                case PLAY_MODES[0].id:
                    playmodeInt = 1;
                    break;
                case PLAY_MODES[1].id:
                    playmodeInt = 2;
                    break;
                case PLAY_MODES[2].id:
                    playmodeInt = 3;
                    break;
                case PLAY_MODES[3].id:
                    playmodeInt = 4;
                    break;
                default:
                    self.log('error', `Invalid playMode ${playmode}`);
                    self.updateStatus(InstanceStatus.UnknownError, `Invalid playMode ${playmode}`);
                    return;
            }
    
            json.playmode = playmodeInt;

            await sendCommand(self, action, address, createTransportJSON(json));
            self.log('info', `Sent go to command: Transport: ${player}, Type: ${cueType}, Target: ${cueTarget}`);
        }
    },   
}

export function updateTransportChoices(self) {
    // Get all transport variables
    const choices = []
    let index = 1
    
    while (self.getVariableValue(`transport${index}_name`)) {
        const transportName = self.getVariableValue(`transport${index}_name`)
        choices.push({ id: transportName, label: transportName })
        index++
    }

    // Update the TargetTransport field definition with new choices
    TRANSPORT_FIELDS.TargetTransport.choices = choices

    // Re-initialize actions to apply the new choices
    getActionDefinitions(self)
}