export async function fetchTransportVariableDefinitions(self, data) {
    const [activetransport, tracks] = data
    const variableDefinitions = []

    // Debug logs
    // self.log('debug', 'Active Transport Data: ' + JSON.stringify(activetransport))
    // self.log('debug', 'Tracks Data: ' + JSON.stringify(tracks))

    // Add variables for each transport using their names
    if (activetransport && activetransport.result) {
        for (const transport of activetransport.result) {
            const transportName = transport.name ? transport.name.replace(/\s+/g, '_') : 'unknown'
            
            variableDefinitions.push(
                { variableId: `transport_${transportName}_name`, name: `Transport ${transport.name}: Name` },
                { variableId: `transport_${transportName}_uid`, name: `Transport ${transport.name}: UID` },
                { variableId: `transport_${transportName}_engaged`, name: `Transport ${transport.name}: Engaged` },
                { variableId: `transport_${transportName}_brightness`, name: `Transport ${transport.name}: Brightness` },
                { variableId: `transport_${transportName}_volume`, name: `Transport ${transport.name}: Volume` },
                { variableId: `transport_${transportName}_playmode`, name: `Transport ${transport.name}: Play Mode` },
                { variableId: `transport_${transportName}_currenttrack_name`, name: `Transport ${transport.name}: Current Track Name` },
                { variableId: `transport_${transportName}_currenttrack_uid`, name: `Transport ${transport.name}: Current Track UID` },
                { variableId: `transport_${transportName}_currenttrack_length`, name: `Transport ${transport.name}: Current Track Length` },
                { variableId: `transport_${transportName}_currenttrack_crossfade`, name: `Transport ${transport.name}: Current Track Crossfade` }
            )
        }
    }

    // Add variables for each track
    if (tracks && tracks.result && tracks.result.tracks) {
        for (const track of tracks.result.tracks) {
            const trackName = track.name ? track.name.replace(/\s+/g, '_') : 'unknown'
            
            variableDefinitions.push(
                { variableId: `track_${trackName}_name`, name: `Track ${track.name}: Name` },
                { variableId: `track_${trackName}_uid`, name: `Track ${track.name}: UID` },
                { variableId: `track_${trackName}_length`, name: `Track ${track.name}: Length` },
                { variableId: `track_${trackName}_currenttime`, name: `Track ${track.name}: Current Time` }
            )
        }
    }

    return variableDefinitions
}

export async function fetchTransportVariableValues(self, data) {
    const [activetransport, tracks] = data
    const variableValues = {}

    // Set values for each transport
    if (activetransport && activetransport.result) {
        for (const transport of activetransport.result) {
            const transportName = transport.name ? transport.name.replace(/\s+/g, '_') : 'unknown'
            
            variableValues[`transport_${transportName}_name`] = transport.name || ''
            variableValues[`transport_${transportName}_uid`] = transport.uid || ''
            variableValues[`transport_${transportName}_engaged`] = transport.engaged || false
            variableValues[`transport_${transportName}_brightness`] = transport.brightness || 0
            variableValues[`transport_${transportName}_volume`] = transport.volume || 0
            variableValues[`transport_${transportName}_playmode`] = transport.playmode || ''

            // Current track information
            if (transport.currentTrack) {
                variableValues[`transport_${transportName}_currenttrack_name`] = transport.currentTrack.name || ''
                variableValues[`transport_${transportName}_currenttrack_uid`] = transport.currentTrack.uid || ''
            }

            // Get track details from setList
            if (transport.setList && transport.setList.tracks) {
                const currentTrack = transport.setList.tracks.find(track => 
                    track.uid === transport.currentTrack?.uid
                )
                if (currentTrack) {
                    variableValues[`transport_${transportName}_currenttrack_length`] = currentTrack.length || 0
                    variableValues[`transport_${transportName}_currenttrack_crossfade`] = currentTrack.crossfade || ''
                }
            }
        }
    }

    // Set values for each track
    if (tracks && tracks.result && tracks.result.tracks) {
        for (const track of tracks.result.tracks) {
            const trackName = track.name ? track.name.replace(/\s+/g, '_') : 'unknown'
            
            variableValues[`track_${trackName}_name`] = track.name || ''
            variableValues[`track_${trackName}_uid`] = track.uid || ''
            variableValues[`track_${trackName}_length`] = track.length || ''
            variableValues[`track_${trackName}_currenttime`] = track.currentTime || ''
        }
    }

    return variableValues
}