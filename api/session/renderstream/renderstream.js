import { sendCommand, getRequest } from '../../../globalFunctions.js'
import { InstanceStatus } from '@companion-module/base'
import { TRANSPORT_FIELDS } from './transportFields.js'
import { PLAY_MODES, TRANSPORT_COMMANDS } from './transportConstants.js';

/* -------------------------------------------------------------------------- */
/*                                   ACTIONS                                  */
/* -------------------------------------------------------------------------- */

export const TRANSPORT_ACTIONS = {

    // post_transport_brightness: {
    //     name: 'Transport: Brightness',
    //     options: [
    //         TRANSPORT_FIELDS.TargetTransport,
    //         TRANSPORT_FIELDS.Brightness,
    //     ],
    //     callback: async (action, context, self) => {
    //         let address = `/api/session/transport/brightness`
    //         let data = {
    //             transports: [
    //                 {
    //                     name: action.options.player,
    //                     brightness: action.options.brightness
    //                 }
    //             ]
    //         }
    //         await sendCommand(self, action, address, data)
    //     },
    // },
}