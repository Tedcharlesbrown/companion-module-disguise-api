export async function fetchAnnotationVariableDefinitions(self, data) {
    const variableDefinitions = []

    // Handle array of annotation results
    if (!Array.isArray(data)) {
        data = [data]
    }

    for (const annotationData of data) {
        const annotations = annotationData.result
        if (!annotations) continue

        // Get transport name from the result and sanitize it for use in variable names
        const transportName = annotations.name ? annotations.name.replace(/\s+/g, '_') : 'unknown'

        // Add variables for notes
        if (annotations.annotations && annotations.annotations.notes) {
            annotations.annotations.notes.forEach((note, index) => {
                variableDefinitions.push(
                    { 
                        variableId: `annotation_track_${transportName}_note${index + 1}_text`, 
                        name: `Track ${annotations.name}: Note ${index + 1} Text` 
                    }
                )
            })
        }

        // Add variables for tags
        if (annotations.annotations && annotations.annotations.tags) {
            annotations.annotations.tags.forEach((tag, index) => {
                variableDefinitions.push(
                    { 
                        variableId: `annotation_track_${transportName}_tag${index + 1}_type`, 
                        name: `Track ${annotations.name}: Tag ${index + 1} Type` 
                    },
                    { 
                        variableId: `annotation_track_${transportName}_tag${index + 1}_value`, 
                        name: `Track ${annotations.name}: Tag ${index + 1} Value` 
                    }
                )
            })
        }
    }

    return variableDefinitions
}

export async function fetchAnnotationVariableValues(self, data) {
    const variableValues = {}

    // Handle array of annotation results
    if (!Array.isArray(data)) {
        data = [data]
    }

    for (const annotationData of data) {
        const annotations = annotationData.result
        if (!annotations) continue

        // Get transport name from the result and sanitize it for use in variable names
        const transportName = annotations.name ? annotations.name.replace(/\s+/g, '_') : 'unknown'

        // Set values for notes
        if (annotations.annotations && annotations.annotations.notes) {
            annotations.annotations.notes.forEach((note, index) => {
                variableValues[`annotation_track_${transportName}_note${index + 1}_text`] = note.text
            })
        }

        // Set values for tags
        if (annotations.annotations && annotations.annotations.tags) {
            annotations.annotations.tags.forEach((tag, index) => {
                variableValues[`annotation_track_${transportName}_tag${index + 1}_type`] = tag.type
                variableValues[`annotation_track_${transportName}_tag${index + 1}_value`] = tag.value
            })
        }
    }

    return variableValues
}