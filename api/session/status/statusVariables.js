export async function fetchStatusVariableDefinitions(self, data) {
	/* -------------------------------------------------------------------------- */
	/*                                   HEALTH                                   */
	/* -------------------------------------------------------------------------- */
	const health = data[0].result;  // Use pre-fetched health data
	const variableDefinitions = [];

	health.forEach((machine) => {
		variableDefinitions.push(
			{ variableId: `machine_${machine.machine.name}_name`, name: `${machine.machine.name}: Name` },
			{ variableId: `machine_${machine.machine.name}_averageFPS`, name: `${machine.machine.name}: Average FPS` },
			{ variableId: `machine_${machine.machine.name}_videoDroppedFrames`, name: `${machine.machine.name}: Video Dropped Frames` },
			{ variableId: `machine_${machine.machine.name}_videoMissedFrames`, name: `${machine.machine.name}: Video Missed Frames` }
		);

		// Loop through states array
		machine.status.states.forEach((state) => {
			const stateVariableId = `machine_${machine.machine.name}_${state.name.replace(/\s/g, '').toLowerCase()}`;
			variableDefinitions.push(
				{ variableId: stateVariableId, name: `${machine.machine.name}: ${state.name}` }
			);
		});
	});

	/* -------------------------------------------------------------------------- */
	/*                                   PROJECT                                  */
	/* -------------------------------------------------------------------------- */
	const project = data[1].result;  // Use pre-fetched project data

	variableDefinitions.push(
		{ variableId: `projectPath`, name: `Project Path` },
		{ variableId: `version`, name: `Version` }
	);

	return variableDefinitions;
}

export async function fetchStatusVariableValues(self, data) {
	/* -------------------------------------------------------------------------- */
	/*                                   HEALTH                                   */
	/* -------------------------------------------------------------------------- */
	const health = data[0].result;  // Use pre-fetched health data
	const variableValues = {};

	health.forEach((machine) => {
		variableValues[`machine_${machine.machine.name}_name`] = machine.machine.name;
		variableValues[`machine_${machine.machine.name}_averageFPS`] = machine.status.averageFPS;
		variableValues[`machine_${machine.machine.name}_videoDroppedFrames`] = machine.status.videoDroppedFrames;
		variableValues[`machine_${machine.machine.name}_videoMissedFrames`] = machine.status.videoMissedFrames;

		// Loop through states array
		machine.status.states.forEach((state) => {
			const stateVariableId = `machine_${machine.machine.name}_${state.name.replace(/\s/g, '').toLowerCase()}`;
			variableValues[stateVariableId] = state.detail;
		});
	});

	/* -------------------------------------------------------------------------- */
	/*                                   PROJECT                                  */
	/* -------------------------------------------------------------------------- */
	const project = data[1].result;  // Use pre-fetched project data

	variableValues[`projectPath`] = project.projectPath;
	variableValues[`version`] = `${project.version.major}.${project.version.minor}.${project.version.hotfix}.${project.version.revision}`;

	return variableValues;
}
