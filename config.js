const REGEX_IP_OR_HOST =
	'/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})$|^((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9]))$/'

export const configFields = [
	{
		type: 'textinput',
		id: 'ipaddress',
		label: 'Target Host name or IP',
		width: 12,
		default: '127.0.0.1',
		regex: REGEX_IP_OR_HOST,
	},
	{
		type: 'checkbox',
		id: 'polling',
		label: 'Enable Polling feedbacks?',
		width: 6,
		default: false,
	},
	{
		type: 'dropdown',
		id: 'polling_interval',
		label: 'Polling Rate',
		width: 6,
		default: 1000,
		choices: [
			{ id: 100, label: '100ms' },
			{ id: 200, label: '200ms' },
			{ id: 500, label: '500ms' },
			{ id: 1000, label: '1s' },
			{ id: 2000, label: '2s' },
			{ id: 5000, label: '5s' },
			{ id: 10000, label: '10s' },
		],
		required: true,
		isVisible: (config) => config.polling,
	},
]