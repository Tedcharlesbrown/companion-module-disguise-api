import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { configFields } from './config.js'
import { upgradeScripts } from './upgrade.js'
import { getActionDefinitions } from './actions.js'
import { defineVariables, updateVariables } from './variables.js'

class GenericHttpInstance extends InstanceBase {
	async configUpdated(config) {
		this.config = config
		getActionDefinitions(this)
		await this.updateData() // Update data when config is updated

		if (this.config.polling) {
			this.startPolling()
		} else {
			this.stopPolling()
		}
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Ok)
		getActionDefinitions(this)
		await defineVariables(this) // Define initial variables on init
		await this.updateData() // Initial data update

		if (this.config.polling) {
			this.startPolling()
		}
	}

	async updateData() {
		try {
			await updateVariables(this)
		} catch (error) {
			this.log('error', `Failed to update variables: ${error.message}`)
		}
	}

	startPolling() {
		if (this.pollingInterval) {
			clearInterval(this.pollingInterval)
		}

		this.pollingInterval = setInterval(() => {
			this.updateData()
		}, this.config.polling_interval)
	}

	stopPolling() {
		if (this.pollingInterval) {
			clearInterval(this.pollingInterval)
			this.pollingInterval = null
		}
	}

	getConfigFields() {
		return configFields
	}

	async destroy() {
		// Any necessary cleanup when the module is destroyed
		if (this.pollingInterval) {
			clearInterval(this.pollingInterval)
		}
	}
}

runEntrypoint(GenericHttpInstance, upgradeScripts)
