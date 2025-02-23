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
            let address = `/api/session/transport/gototag`
            let data = {
                transports: [
                    {
                        transport: {
                            name: action.options.player,
                            uid: self.getVariableValue(`transport_${action.options.player.replace(/\s+/g, '_')}_uid`)
                        },
                        type: action.options.tagType,
                        value: action.options.tagValue,
                        allowGlobalJump: action.options.allowGlobalJump,
                        playmode: action.options.playmode
                    }
                ]
            }
            await sendCommand(self, action, address, data)
        },
    },   
}

export function updateTransportChoices(self) {
    const choices = []
    const allCueOptions = []
    
    // First, collect all CUE tags from all tracks
    if (self.transport_tracks && self.transport_tracks.result) {
        self.transport_tracks.result.forEach(track => {
            const trackName = track.name ? track.name.replace(/\s+/g, '_') : 'unknown'
            let tagIndex = 1
            
            while (true) {
                const tagType = self.getVariableValue(`track_${trackName}_tag${tagIndex}_type`)
                const tagValue = self.getVariableValue(`track_${trackName}_tag${tagIndex}_value`)
                
                if (!tagType || !tagValue) break
                
                if (tagType === 'CUE') {
                    allCueOptions.push({
                        id: tagValue,
                        label: `${tagValue} (${track.name})`
                    })
                }
                
                tagIndex++
            }
        })
    }
    
    // Get all active transports
    if (self.transport_activetransport && self.transport_activetransport.result) {
        self.transport_activetransport.result.forEach(transport => {
            const transportName = transport.name ? transport.name.replace(/\s+/g, '_') : 'unknown'
            if (self.getVariableValue(`transport_${transportName}_name`)) {
                choices.push({ 
                    id: transport.name,
                    label: transport.name
                })
            }
        })
    }

    // Update the TargetTransport field definition with new choices
    TRANSPORT_FIELDS.TargetTransport.choices = choices
    
    // Update CUE choices directly
    TRANSPORT_FIELDS.CUE_GoToTarget.choices = allCueOptions

    // Re-initialize actions to apply the new choices
    getActionDefinitions(self)
}

// Simplified updateCueChoices since we're showing all CUE tags
export function updateCueChoices(action) {
    // No need to update choices based on transport selection anymore
    // The choices are now always all available CUE tags
    return
}