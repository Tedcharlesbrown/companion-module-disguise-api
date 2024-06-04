import { fetchTransportVariableDefinitions, fetchTransportVariableValues } from './api/session/transport/transport.js'

export async function defineVariables(self) {
	try {
		const variableDefinitions = await fetchTransportVariableDefinitions(self)
		self.setVariableDefinitions(variableDefinitions)
	} catch (error) {
		self.log('error', `Failed to define variables: ${error.message}`)
	}
}

export async function updateVariables(self) {
	try {
		const variableValues = await fetchTransportVariableValues(self)
		self.setVariableValues(variableValues)
	} catch (error) {
		self.log('error', `Failed to update variables: ${error.message}`)
	}
}