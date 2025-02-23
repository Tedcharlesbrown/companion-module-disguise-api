import { fetchTransportVariableDefinitions, fetchTransportVariableValues } from './api/session/transport/transportVariables.js'
import { fetchStatusVariableDefinitions, fetchStatusVariableValues} from './api/session/status/statusVariables.js'
import { fetchRenderStreamVariableDefinitions } from './api/session/renderstream/renderstreamVariables.js'
import { sendCommand, getRequest } from './globalFunctions.js'
import { updateTransportChoices } from './api/session/transport/transport.js'
import { fetchAnnotationVariableDefinitions, fetchAnnotationVariableValues } from './api/session/transport/annotationVariables.js'

export async function request_api(self) {
	self.status_health = await getRequest(`http://${self.config.ipaddress}/api/session/status/health`)
	self.status_project = await getRequest(`http://${self.config.ipaddress}/api/session/status/project`)
	self.transport_activetransport = await getRequest(`http://${self.config.ipaddress}/api/session/transport/activetransport`)
	self.transport_tracks = await getRequest(`http://${self.config.ipaddress}/api/session/transport/tracks`)
	
	// Get annotations for all tracks
	try {
		if (self.transport_tracks && self.transport_tracks.result) {
			self.transport_annotations = { result: [] }
			
			for (const track of self.transport_tracks.result) {
				if (track.uid) {
					try {
						const trackAnnotations = await getRequest(`http://${self.config.ipaddress}/api/session/transport/annotations?uid=${track.uid}`)
						if (trackAnnotations && trackAnnotations.result) {
							trackAnnotations.result.name = track.name
							self.transport_annotations.result.push(trackAnnotations.result)
						}
					} catch (trackError) {
						self.log('debug', `Failed to get annotations for track ${track.name}: ${trackError.message}`)
					}
				}
			}
		}
	} catch (error) {
		self.log('debug', `Failed to get annotations: ${error.message}`)
		self.transport_annotations = { result: [] }
	}
	
	updateTransportChoices(self)
}

export async function defineVariables(self) {
	await request_api(self)

	try {
		const transportVariableDefinitions = await fetchTransportVariableDefinitions(self, [self.transport_activetransport, self.transport_tracks]);
		const statusVariableDefinitions = await fetchStatusVariableDefinitions(self, [self.status_health, self.status_project]);
		const annotationVariableDefinitions = await fetchAnnotationVariableDefinitions(self, self.transport_annotations);

		const allVariableDefinitions = [
			...transportVariableDefinitions,
			...statusVariableDefinitions,
			...annotationVariableDefinitions
		];

		self.setVariableDefinitions(allVariableDefinitions);
	} catch (err) {
		self.log('error', `Failed to fetch and set variable definitions: ${err.message}`);
	}	
}

export async function updateVariables(self) {
	try {
		const transportVariableValues = await fetchTransportVariableValues(self, [self.transport_activetransport, self.transport_tracks]);
		const statusVariableValues = await fetchStatusVariableValues(self, [self.status_health, self.status_project]);
		const annotationVariableValues = await fetchAnnotationVariableValues(self, self.transport_annotations);

		const allVariableValues = {
			...transportVariableValues,
			...statusVariableValues,
			...annotationVariableValues
		};

		self.setVariableValues(allVariableValues);
	} catch (error) {
		self.log('error', `Failed to update variables: ${error.message}`);
	}
}
