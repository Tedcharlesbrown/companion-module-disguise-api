export async function fetchRenderStreamVariableDefinitions(self, data) {
	/* -------------------------------------------------------------------------- */
	/*                               ASSIGNERS                                   */
	/* -------------------------------------------------------------------------- */
	const assigners = data[0].result;
	const variableDefinitions = [];

	assigners.forEach((assigner) => {
		variableDefinitions.push(
			{ variableId: `assigner_${assigner.id}_name`, name: `Assigner: ${assigner.name}` },
			{ variableId: `assigner_${assigner.id}_status`, name: `Assigner: ${assigner.status}` }
		);
	});

	/* -------------------------------------------------------------------------- */
	/*                               LAYER CONFIG                                */
	/* -------------------------------------------------------------------------- */
	const layerConfig = data[1].result;

	layerConfig.forEach((layer) => {
		variableDefinitions.push(
			{ variableId: `layerconfig_${layer.id}_name`, name: `Layer Config: ${layer.name}` },
			{ variableId: `layerconfig_${layer.id}_type`, name: `Layer Config: ${layer.type}` }
		);
	});

	/* -------------------------------------------------------------------------- */
	/*                                   LAYERS                                   */
	/* -------------------------------------------------------------------------- */
	const layers = data[2].result;

	layers.forEach((layer) => {
		variableDefinitions.push(
			{ variableId: `layer_${layer.id}_name`, name: `Layer: ${layer.name}` },
			{ variableId: `layer_${layer.id}_priority`, name: `Layer: Priority` }
		);
	});

	/* -------------------------------------------------------------------------- */
	/*                               LAYER STATUS                                */
	/* -------------------------------------------------------------------------- */
	const layerStatus = data[3].result;

	layerStatus.forEach((status) => {
		variableDefinitions.push(
			{ variableId: `layerstatus_${status.layerId}_active`, name: `Layer Status: ${status.layerId} Active` },
			{ variableId: `layerstatus_${status.layerId}_errors`, name: `Layer Status: ${status.layerId} Errors` }
		);
	});

	/* -------------------------------------------------------------------------- */
	/*                                   POOLS                                    */
	/* -------------------------------------------------------------------------- */
	const pools = data[4].result;

	pools.forEach((pool) => {
		variableDefinitions.push(
			{ variableId: `pool_${pool.id}_name`, name: `Pool: ${pool.name}` },
			{ variableId: `pool_${pool.id}_capacity`, name: `Pool: ${pool.capacity}` }
		);
	});

	return variableDefinitions;
}

export async function fetchRenderStreamVariableValues(self, data) {
	/* -------------------------------------------------------------------------- */
	/*                               ASSIGNERS                                   */
	/* -------------------------------------------------------------------------- */
	const assigners = data[0].result;
	const variableValues = {};

	assigners.forEach((assigner) => {
		variableValues[`assigner_${assigner.id}_name`] = assigner.name;
		variableValues[`assigner_${assigner.id}_status`] = assigner.status;
	});

	/* -------------------------------------------------------------------------- */
	/*                               LAYER CONFIG                                */
	/* -------------------------------------------------------------------------- */
	const layerConfig = data[1].result;

	layerConfig.forEach((layer) => {
		variableValues[`layerconfig_${layer.id}_name`] = layer.name;
		variableValues[`layerconfig_${layer.id}_type`] = layer.type;
	});

	/* -------------------------------------------------------------------------- */
	/*                                   LAYERS                                   */
	/* -------------------------------------------------------------------------- */
	const layers = data[2].result;

	layers.forEach((layer) => {
		variableValues[`layer_${layer.id}_name`] = layer.name;
		variableValues[`layer_${layer.id}_priority`] = layer.priority;
	});

	/* -------------------------------------------------------------------------- */
	/*                               LAYER STATUS                                */
	/* -------------------------------------------------------------------------- */
	const layerStatus = data[3].result;

	layerStatus.forEach((status) => {
		variableValues[`layerstatus_${status.layerId}_active`] = status.active;
		variableValues[`layerstatus_${status.layerId}_errors`] = status.errors;
	});

	/* -------------------------------------------------------------------------- */
	/*                                   POOLS                                    */
	/* -------------------------------------------------------------------------- */
	const pools = data[4].result;

	pools.forEach((pool) => {
		variableValues[`pool_${pool.id}_name`] = pool.name;
		variableValues[`pool_${pool.id}_capacity`] = pool.capacity;
	});

	return variableValues;
}
