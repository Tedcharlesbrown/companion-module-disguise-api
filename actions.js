import { TRANSPORT_ACTIONS } from './api/session/transport/transport.js'
import { PROJECT_ACTIONS } from './api/service/project/project.js' 

export function getActionDefinitions(self) {
	self.setActionDefinitions({
        /* -------------------------------------------------------------------------- */
        /*                                   SERVICE                                  */
        /* -------------------------------------------------------------------------- */

        /* --------------------------------- PROJECT -------------------------------- */
        service_post_project_startlocalproject: {
            ...PROJECT_ACTIONS.post_project_startlocalproject,
            callback: (action, context) => PROJECT_ACTIONS.post_project_startlocalproject.callback(action, context, self),
        },
        service_post_project_quitlocalproject: {
            ...PROJECT_ACTIONS.post_project_quitlocalproject,
            callback: (action, context) => PROJECT_ACTIONS.post_project_quitlocalproject.callback(action, context, self),
        },
        service_post_project_restartlocalproject: {
            ...PROJECT_ACTIONS.post_project_restartlocalproject,
            callback: (action, context) => PROJECT_ACTIONS.post_project_restartlocalproject.callback(action, context, self),
        },
        /* -------------------------------------------------------------------------- */
        /*                                   SESSION                                  */
        /* -------------------------------------------------------------------------- */

        /* -------------------------------- TRANSPORT ------------------------------- */
		session_post_transport_brightness: {
			...TRANSPORT_ACTIONS.post_transport_brightness,
            callback: (action, context) => TRANSPORT_ACTIONS.post_transport_brightness.callback(action, context, self),
		},
		session_post_transport_volume: {
			...TRANSPORT_ACTIONS.post_transport_volume,
            callback: (action, context) => TRANSPORT_ACTIONS.post_transport_volume.callback(action, context, self),
		},
        session_post_transport_engaged: {
            ...TRANSPORT_ACTIONS.post_transport_engaged,
            callback: (action, context) => TRANSPORT_ACTIONS.post_transport_engaged.callback(action, context, self),
        },
		session_post_transport_command: {
			...TRANSPORT_ACTIONS.post_transport_command,
            callback: (action, context) => TRANSPORT_ACTIONS.post_transport_command.callback(action, context, self),
		},
		session_post_transport_playmode: {
			...TRANSPORT_ACTIONS.post_transport_playmode,
            callback: (action, context) => TRANSPORT_ACTIONS.post_transport_playmode.callback(action, context, self),
		},
        session_post_transport_gotocue: {
            ...TRANSPORT_ACTIONS.post_transport_gotocue,
            callback: (action, context) => TRANSPORT_ACTIONS.post_transport_gotocue.callback(action, context, self),
        },
	})
}
