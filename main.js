import { InstanceBase, runEntrypoint, InstanceStatus } from '@companion-module/base'
import { configFields } from './config.js'
import { upgradeScripts } from './upgrade.js'
import { getActionDefinitions } from './actions.js'
import { defineVariables, updateVariables } from './variables.js'
import net from 'net';

class DisguiseRestInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.config = {}
		this.log('debug', 'Constructor initialized')
		this.intervalId = null
		this.isConnected = false
	}

	async init(config) {
		try {
			this.log('debug', 'Starting module initialization')
			
			// Set default config if none exists
			this.config = config || {
				ipaddress: '127.0.0.1',
				polling: false,
				polling_interval: 1000
			}

			this.log('debug', `Initial config loaded`)

			// Start with ConnectionFailure status since we haven't connected yet
			this.updateStatus(InstanceStatus.ConnectionFailure, 'Not connected to Disguise')
			
			// Set up initial empty definitions
			this.setActionDefinitions({})
			this.setVariableDefinitions([])
			
			this.log('debug', 'Module initialized successfully')
		} catch (error) {
			this.log('error', `Initialization error: ${error.toString()}`)
			this.updateStatus(InstanceStatus.UnknownError, error.toString())
		}
	}

	async configUpdated(config) {
		this.log('debug', 'Config update started')
		
		try {
			this.config = config
			this.updateStatus(InstanceStatus.Connecting)

			// Stop existing polling if any
			if (this.intervalId) {
				this.stopPolling()
			}

			// Only try to connect if we have an IP address
			if (this.config.ipaddress) {
				try {
					const connected = await this.checkConnection(this.config.ipaddress)
					this.log('debug', `Connection check result: ${connected}`)
					
					if (connected) {
						this.isConnected = true
						this.updateStatus(InstanceStatus.Ok)
						// Don't load actions/variables until we know we're connected
						this.initializeActions()
					} else {
						this.isConnected = false
						this.updateStatus(InstanceStatus.ConnectionFailure, 'Could not connect to Disguise')
					}
				} catch (error) {
					this.isConnected = false
					this.log('error', `Connection error: ${error.toString()}`)
					this.updateStatus(InstanceStatus.ConnectionFailure, 'Connection failed')
				}
			} else {
				this.updateStatus(InstanceStatus.BadConfig, 'IP Address not set')
			}

			// Only start polling if we're connected and polling is enabled
			if (this.isConnected && this.config.polling) {
				this.startPolling()
			}
		} catch (error) {
			this.log('error', `Config update error: ${error.toString()}`)
			this.updateStatus(InstanceStatus.UnknownError, error.toString())
		}
	}

	initializeActions() {
		try {
			// Call getActionDefinitions directly with this instance
			getActionDefinitions(this)
		} catch (error) {
			this.log('error', `Action initialization error: ${error.toString()}`)
		}
	}

	checkConnection(ip) {
		this.log('debug', `Checking connection to ${ip}`)
		return new Promise((resolve) => {
			const socket = new net.Socket()
			socket.setTimeout(2000) // Shorter timeout for initial check

			socket.connect(80, ip, () => {
				this.log('debug', 'Connection successful')
				socket.end()
				resolve(true)
			})

			socket.on('error', (err) => {
				this.log('warning', `Connection error: ${err.toString()}`)
				socket.destroy()
				resolve(false)
			})

			socket.on('timeout', () => {
				this.log('warning', 'Connection timeout')
				socket.destroy()
				resolve(false)
			})
		})
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
