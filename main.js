import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { configFields } from './config.js'
import { upgradeScripts } from './upgrade.js'
import { getActionDefinitions } from './actions.js'
import { defineVariables, updateVariables } from './variables.js'
import net from 'net';

class DisguiseRestInstance extends InstanceBase {
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
		this.config = config;
		this.updateStatus(InstanceStatus.Connecting); // Set connecting status initially
	
		const isConnected = await this.checkConnection(this.config.ipaddress);
	
		if (isConnected) {
			this.updateStatus(InstanceStatus.Ok);
			this.log('info', `Successfully connected to Disguise at ${this.config.ipaddress}`);
		} else {
			this.updateStatus(InstanceStatus.ConnectionFailure);
			this.log('error', 'Failed to connect to Disguise');
		}
	
		await defineVariables(this); // Define initial variables on init
		await updateVariables(this);
		getActionDefinitions(this);
	
		if (this.config.polling) {
			this.startPolling();
		}
	}
	
	checkConnection(ip) {
		this.log('debug', "Connecting to Disguise");
		return new Promise((resolve) => {
			const socket = new net.Socket();
			socket.setTimeout(5000);	// 5 second timeout

			socket.connect(80, ip, () => {
				socket.end();
				resolve(true);
			});
	
			socket.on('error', () => {
				socket.destroy();
				resolve(false);
			});
	
			socket.on('timeout', () => {
				socket.destroy();
				resolve(false);
			});
		});
	}

	async updateData() {
		try {
			await defineVariables(this)
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
			this.log('debug', 'Polling for updates')
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

runEntrypoint(DisguiseRestInstance, upgradeScripts)
