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
			// Initialize array to store all annotation results
			self.transport_annotations = { result: [] }
			
			self.log('debug', 'Fetching annotations for tracks: ' + JSON.stringify(self.transport_tracks.result))
			
			// Fetch annotations for each track
			for (const track of self.transport_tracks.result) {
				if (track.uid) {
					try {
						const annotationUrl = `http://${self.config.ipaddress}/api/session/transport/annotations?uid=${track.uid}`
						self.log('debug', `Fetching annotations from: ${annotationUrl}`)
						
						const trackAnnotations = await getRequest(annotationUrl)
						self.log('debug', `Received annotations for track ${track.name}: ${JSON.stringify(trackAnnotations)}`)
						
						if (trackAnnotations && trackAnnotations.result) {
							// Add track name to the annotation result for reference
							trackAnnotations.result.name = track.name
							self.transport_annotations.result.push(trackAnnotations.result)
						}
					} catch (trackError) {
						self.log('debug', `Failed to get annotations for track ${track.name}: ${trackError.message}`)
					}
				}
			}
			
			self.log('debug', 'Final annotations object: ' + JSON.stringify(self.transport_annotations))
		}
	} catch (error) {
		self.log('debug', `Failed to get annotations: ${error.message}`)
		self.transport_annotations = { result: [] }
	}
	
	// Update transport choices after getting new data
	updateTransportChoices(self)
}

export async function defineVariables(self) {
	await request_api(self)

	try {
		// Fetch variable definitions
		const transportVariableDefinitions = await fetchTransportVariableDefinitions(self, [self.transport_activetransport, self.transport_tracks]);
		const statusVariableDefinitions = await fetchStatusVariableDefinitions(self, [self.status_health, self.status_project]);
		const annotationVariableDefinitions = await fetchAnnotationVariableDefinitions(self, self.transport_annotations);

		// Debug log before merging
		self.log('debug', 'Transport Variables: ' + JSON.stringify(transportVariableDefinitions));
		self.log('debug', 'Status Variables: ' + JSON.stringify(statusVariableDefinitions));
		self.log('debug', 'Annotation Variables: ' + JSON.stringify(annotationVariableDefinitions));

		// Merge all variable definitions
		const allVariableDefinitions = [
			...transportVariableDefinitions,
			...statusVariableDefinitions,
			...annotationVariableDefinitions
		];

		// Debug log final definitions
		self.log('debug', 'Setting variable definitions: ' + JSON.stringify(allVariableDefinitions));

		// Set the merged variable definitions
		self.setVariableDefinitions(allVariableDefinitions);
	} catch (err) {
		self.log('error', `Failed to fetch and set variable definitions: ${err.message}`);
	}	
}

export async function updateVariables(self) {
	try {
		// Fetch variable values
		const transportVariableValues = await fetchTransportVariableValues(self, [self.transport_activetransport, self.transport_tracks]);
		const statusVariableValues = await fetchStatusVariableValues(self, [self.status_health, self.status_project]);
		const annotationVariableValues = await fetchAnnotationVariableValues(self, self.transport_annotations);

		// Debug log before merging
		self.log('debug', 'Transport Values: ' + JSON.stringify(transportVariableValues));
		self.log('debug', 'Status Values: ' + JSON.stringify(statusVariableValues));
		self.log('debug', 'Annotation Values: ' + JSON.stringify(annotationVariableValues));

		// Merge all variable values
		const allVariableValues = {
			...transportVariableValues,
			...statusVariableValues,
			...annotationVariableValues
		};

		// Debug log final values
		self.log('debug', 'Setting variable values: ' + JSON.stringify(allVariableValues));

		// Set the merged variable values
		self.setVariableValues(allVariableValues);
	} catch (error) {
		self.log('error', `Failed to update variables: ${error.message}`);
	}
}
