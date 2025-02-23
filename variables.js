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
	
	// Get annotations for all transports in one request
	try {
		self.transport_annotations = await getRequest(`http://${self.config.ipaddress}/api/session/transport/annotations`)
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

		// Merge all variable definitions
		const allVariableDefinitions = [
			...transportVariableDefinitions,
			...statusVariableDefinitions,
			...annotationVariableDefinitions
		];

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

		// Merge all variable values
		const allVariableValues = {
			...transportVariableValues,
			...statusVariableValues,
			...annotationVariableValues
		};

		// Set the merged variable values
		self.setVariableValues(allVariableValues);
	} catch (error) {
		self.log('error', `Failed to update variables: ${error.message}`);
	}
}
