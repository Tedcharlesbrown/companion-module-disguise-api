export async function fetchAnnotationVariableDefinitions(self, data) {
    const variableDefinitions = []

    // Debug log the input data
    // self.log('debug', 'Annotation data for variable definitions: ' + JSON.stringify(data))

    // Handle array of annotation results
    if (data && data.result) {
        for (const annotation of data.result) {
            if (!annotation) continue

            // Get track name and sanitize it for use in variable names
            const trackName = annotation.name ? annotation.name.replace(/\s+/g, '_') : 'unknown'
            // self.log('debug', `Processing annotations for track: ${trackName}`)

            // Add variables for notes
            if (annotation.annotations && annotation.annotations.notes) {
                annotation.annotations.notes.forEach((note, index) => {
                    variableDefinitions.push({ 
                        variableId: `track_${trackName}_note${index + 1}_text`, 
                        name: `Track ${annotation.name}: Note ${index + 1} Text` 
                    })
                })
            }

            // Add variables for tags
            if (annotation.annotations && annotation.annotations.tags) {
                annotation.annotations.tags.forEach((tag, index) => {
                    variableDefinitions.push(
                        { 
                            variableId: `track_${trackName}_tag${index + 1}_type`, 
                            name: `Track ${annotation.name}: Tag ${index + 1} Type` 
                        },
                        { 
                            variableId: `track_${trackName}_tag${index + 1}_value`, 
                            name: `Track ${annotation.name}: Tag ${index + 1} Value` 
                        }
                    )
                })
            }
        }
    }

    // Debug log the output
    // self.log('debug', 'Created variable definitions: ' + JSON.stringify(variableDefinitions))
    return variableDefinitions
}

export async function fetchAnnotationVariableValues(self, data) {
    const variableValues = {}

    // Debug log the input data
    // self.log('debug', 'Annotation data for variable values: ' + JSON.stringify(data))

    // Handle array of annotation results
    if (data && data.result) {
        for (const annotation of data.result) {
            if (!annotation) continue

            // Get track name and sanitize it for use in variable names
            const trackName = annotation.name ? annotation.name.replace(/\s+/g, '_') : 'unknown'
            // self.log('debug', `Setting values for track: ${trackName}`)

            // Set values for notes
            if (annotation.annotations && annotation.annotations.notes) {
                annotation.annotations.notes.forEach((note, index) => {
                    variableValues[`track_${trackName}_note${index + 1}_text`] = note.text || ''
                })
            }

            // Set values for tags
            if (annotation.annotations && annotation.annotations.tags) {
                annotation.annotations.tags.forEach((tag, index) => {
                    variableValues[`track_${trackName}_tag${index + 1}_type`] = tag.type || ''
                    variableValues[`track_${trackName}_tag${index + 1}_value`] = tag.value || ''
                })
            }
        }
    }

    // Debug log the output
    // self.log('debug', 'Created variable values: ' + JSON.stringify(variableValues))
    return variableValues
}