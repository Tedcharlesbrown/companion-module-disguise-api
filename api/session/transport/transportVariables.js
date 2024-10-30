export async function fetchTransportVariableDefinitions(self, data) {
    const transports = data[0].result
    const variableDefinitions = []

    transports.forEach((transport, index) => {
        const transportIndex = index + 1
        variableDefinitions.push(
            { variableId: `transport${transportIndex}_name`, name: `Transport ${transportIndex} Name` },
            { variableId: `transport${transportIndex}_engaged`, name: `Transport ${transportIndex} Engaged` },
            { variableId: `transport${transportIndex}_volume`, name: `Transport ${transportIndex} Volume` },
            { variableId: `transport${transportIndex}_brightness`, name: `Transport ${transportIndex} Brightness` },
            { variableId: `transport${transportIndex}_playmode`, name: `Transport ${transportIndex} Play Mode` },
            { variableId: `transport${transportIndex}_currentTrack`, name: `Transport ${transportIndex} Current Track` },
            { variableId: `transport${transportIndex}_receivingTimecode`, name: `Transport ${transportIndex} Receiving Timecode` }
        )
    })
    const tracks = data[1].result

    tracks.forEach((track, index) => {
        const trackIndex = index + 1; // Use the index from the forEach loop
        variableDefinitions.push(
           { variableId: `track${trackIndex}_name`, name: `Track ${trackIndex} Name` }
        );
    });

    return variableDefinitions
}

export async function fetchTransportVariableValues(self) {
    const transports = self.transport_activetransport.result.reverse();
    const variableValues = {};

    transports.forEach((transport, index) => {
        const transportIndex = index + 1;
        variableValues[`transport${transportIndex}_name`] = transport.name;
        variableValues[`transport${transportIndex}_engaged`] = transport.engaged;
        variableValues[`transport${transportIndex}_volume`] = transport.volume;
        variableValues[`transport${transportIndex}_brightness`] = transport.brightness;
        variableValues[`transport${transportIndex}_playmode`] = transport.playmode;
        variableValues[`transport${transportIndex}_currentTrack`] = transport.currentTrack ? transport.currentTrack.name : 'N/A';
        variableValues[`transport${transportIndex}_receivingTimecode`] = transport.receivingTimecode;
    });

    const tracks = self.transport_tracks.result;

    tracks.sort((a, b) => a.name.localeCompare(b.name)); // Sort tracks alphabetically by name

    tracks.forEach((track, index) => {
        const trackIndex = index + 1;
        variableValues[`track${trackIndex}_name`] = track.name;
    });

    return variableValues;
}