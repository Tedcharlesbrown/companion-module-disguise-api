import got from 'got'
/* -------------------------------------------------------------------------- */
/*                                  REQUESTS                                  */
/* -------------------------------------------------------------------------- */

export async function postRequest(url, data) {
	console.log(url, data)
	try {
		const response = await got.post(url, {
			json: data,
			responseType: 'json',
		})
		console.log('Request successful:', response.body)
		return response.body
	} catch (error) {
		console.error('Request failed:', error)
		throw error
	}
}

export async function getRequest(url) {
	try {
		const response = await got(url, {
			responseType: 'json'
		})
		// console.log('Request successful:', response.body)
		return response.body
	} catch (error) {
		console.error('Request failed:', error)
		throw error
	}
}

/* -------------------------------------------------------------------------- */
/*                          POST REQUEST SEND HELPER                          */
/* -------------------------------------------------------------------------- */

export async function sendCommand(self, action, address, data) {
    address = `http://${self.config.ipaddress}${address}`
    try {
        self.log('console', `Sending command to ${address}`)
        await postRequest(address, data)
    } catch (error) {
        self.log('error', `Failed to play transport ${action.options.player}: ${error.message}`)
        self.updateStatus(InstanceStatus.UnknownError, error.message)
    }
}