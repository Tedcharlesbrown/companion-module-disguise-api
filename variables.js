import { fetchTransportVariableDefinitions, fetchTransportVariableValues } from './api/session/transport/transportVariables.js'
import { fetchStatusVariableDefinitions, fetchStatusVariableValues} from './api/session/status/statusVariables.js'
import { fetchRenderStreamVariableDefinitions } from './api/session/renderstream/renderstreamVariables.js'
import { sendCommand, getRequest } from './globalFunctions.js'

export async function request_api(self) {
	self.status_health = await getRequest(`http://${self.config.ipaddress}/api/session/status/health`)
	self.status_project = await getRequest(`http://${self.config.ipaddress}/api/session/status/project`)
	self.transport_activetransport = await getRequest(`http://${self.config.ipaddress}/api/session/transport/activetransport`)
	self.transport_tracks = await getRequest(`http://${self.config.ipaddress}/api/session/transport/tracks`)
}

export async function defineVariables(self) {
	await request_api(self)

	try {
		// Fetch both transport and status variable definitions
		const transportVariableDefinitions = await fetchTransportVariableDefinitions(self, [self.transport_activetransport, self.transport_tracks]);
		const statusVariableDefinitions = await fetchStatusVariableDefinitions(self, [self.status_health, self.status_project]);

		// Merge the two sets of variable definitions
		const allVariableDefinitions = [
			...transportVariableDefinitions,
			...statusVariableDefinitions
		];

		// Set the merged variable definitions
		self.setVariableDefinitions(allVariableDefinitions);
	} catch (err) {
		self.log('error', `Failed to fetch and set variable definitions: ${err.message}`);
	}	
}

export async function updateVariables(self) {
	try {
		// Fetch both transport and status variable values
		const transportVariableValues = await fetchTransportVariableValues(self, [self.transport_activetransport, self.transport_tracks]);
		const statusVariableValues = await fetchStatusVariableValues(self, [self.status_health, self.status_project]);

		// Merge the variable values
		const allVariableValues = {
			...transportVariableValues,
			...statusVariableValues
		};

		// Set the merged variable values
		self.setVariableValues(allVariableValues);
	} catch (error) {
		self.log('error', `Failed to update variables: ${error.message}`);
	}
}
