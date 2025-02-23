export async function fetchAnnotationVariableDefinitions(self, data) {
    const variableDefinitions = []

    // Handle single annotation result
    const annotations = data.result
    if (!annotations) return variableDefinitions

    // Get transport name from the result and sanitize it for use in variable names
    const trackName = annotations.name ? annotations.name.replace(/\s+/g, '_') : 'unknown'

    // Add variables for notes
    if (annotations.annotations && annotations.annotations.notes) {
        annotations.annotations.notes.forEach((note, index) => {
            variableDefinitions.push(
                { 
                    variableId: `track_${trackName}_note${index + 1}_text`, 
                    name: `Track ${trackName}: Note ${index + 1} Text` 
                }
            )
        })
    }

    // Add variables for tags
    if (annotations.annotations && annotations.annotations.tags) {
        annotations.annotations.tags.forEach((tag, index) => {
            variableDefinitions.push(
                { 
                    variableId: `track_${trackName}_tag${index + 1}_type`, 
                    name: `Track ${trackName}: Tag ${index + 1} Type` 
                },
                { 
                    variableId: `track_${trackName}_tag${index + 1}_value`, 
                    name: `Track ${trackName}: Tag ${index + 1} Value` 
                }
            )
        })
    }

    return variableDefinitions
}

export async function fetchAnnotationVariableValues(self, data) {
    const variableValues = {}

    // Handle single annotation result
    const annotations = data.result
    if (!annotations) return variableValues

    // Get transport name from the result and sanitize it for use in variable names
    const trackName = annotations.name ? annotations.name.replace(/\s+/g, '_') : 'unknown'

    // Set values for notes
    if (annotations.annotations && annotations.annotations.notes) {
        annotations.annotations.notes.forEach((note, index) => {
            variableValues[`track_${trackName}_note${index + 1}_text`] = note.text
        })
    }

    // Set values for tags
    if (annotations.annotations && annotations.annotations.tags) {
        annotations.annotations.tags.forEach((tag, index) => {
            variableValues[`track_${trackName}_tag${index + 1}_type`] = tag.type
            variableValues[`track_${trackName}_tag${index + 1}_value`] = tag.value
        })
    }

    return variableValues
}