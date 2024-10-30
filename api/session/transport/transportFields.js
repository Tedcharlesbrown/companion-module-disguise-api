import { PLAY_MODES, TRANSPORT_COMMANDS, CUE_TYPES, TAG_TYPES, TIME_TYPES } from './transportConstants.js';

export const TRANSPORT_FIELDS = {
    Brightness: {
        type: 'number',
        label: 'Brightness',
        id: 'brightness',
        default: 0,
        min: 0,
        max: 1,
        step: 0.01,
        regex: '/^\\d*(\\.\\d+)?$/'
    },

    Volume: {
        type: 'number',
        label: 'Volume',
        id: 'volume',
        default: 0,
        min: 0,
        max: 1,
        step: 0.01,
        regex: '/^\\d*(\\.\\d+)?$/'
    },

    Engaged: {
        type: 'checkbox',
        label: 'Engaged',
        id: 'engaged',
        default: true
    },

    PlayMode: {
        type: 'dropdown',
        label: 'PlayMode',
        id: 'playmode',
        default: 'playSection',
        choices: PLAY_MODES
    },

    TransportCommand: {
        type: 'dropdown',
        label: 'Command',
        id: 'command',
        default: 'nextsection',
        choices: TRANSPORT_COMMANDS
    },

    TargetTransport: {
        type: 'textinput',
        label: 'Transport',
        id: 'player',
        default: '',
        tooltip: 'Transport to target, ex: "default"',
        regex: '/.*/',
        useVariables: true,
    },


    /* -------------------------------------------------------------------------- */
    /*                                  GO TO CUE                                 */
    /* -------------------------------------------------------------------------- */

    // DROPDOWN FOR CUE TYPES
    GoToCueType: {
        type: 'dropdown',
        label: 'Go To:',
        id: 'cueType',
        default: 'gototag',
        choices: CUE_TYPES
    },

    /* -------------------------------- GO TO TAG ------------------------------- */
    TAG_AllowGlobalJump: {
        type: 'checkbox',
        label: 'Allow Global Jump',
        id: 'allowGlobalJump',
        default: true,
        tooltip: 'Careful! Disguise will use the crossfade time of the current section',
        isVisible: (options) => options.cueType === 'gototag'
    },
    // DROPDOWN FOR TAG TYPES
    TAG_GoToTagType: {
        type: 'dropdown',
        label: 'Tag Type',
        id: 'tagType',
        default: 'CUE',
        choices: TAG_TYPES,
        isVisible: (options) => options.cueType === 'gototag'
    },
    /* -------------------------------- GO TO CUE ------------------------------- */
    CUE_GoToTarget: {
        type: 'textinput',
        label: 'Cue',
        id: 'cueTarget',
        default: '',
        isVisible: (options) => options.cueType === 'gototag' && options.tagType === 'CUE',
        // regex: '/^\\d*(\\.\\d+)?$/',
        useVariables: true,
    },
    /* ------------------------------- GO TO MIDI ------------------------------- */
    MIDI_GoToTarget: {
        type: 'textinput',
        label: 'MIDI',
        id: 'midiTarget',
        default: '',
        isVisible: (options) => options.cueType === 'gototag' && options.tagType === 'MIDI',
        regex: '/^\\d*(\\.\\d+)?$/',
        useVariables: true,
    },
    /* ------------------------------- GO TO NOTE ------------------------------- */
    NOTE_GoToTarget: {
        type: 'textinput',
        label: 'Note',
        id: 'noteTarget',
        default: '',
        isVisible: (options) => options.cueType === 'gotonote',
        regex: '/.*/',
        useVariables: true,
    },

    /* -------------------------------------------------------------------------- */
    /*                                 GO TO TIME                                 */
    /* -------------------------------------------------------------------------- */
    TIME_GoToTimeType: {
        type: 'dropdown',
        label: 'Time Type',
        id: 'timeType',
        default: 'timecode',
        choices: TIME_TYPES,
        isVisible: (options) => options.cueType === 'gototime',
        useVariables: true,
    },
    /* ----------------------------- GO TO TIMECODE ----------------------------- */
    TC_IgnoreTag: {
        type: 'checkbox',
        label: 'Ignore Tag',
        id: 'ignoreTags',
        default: true,
        isVisible: (options) => options.timeType === 'timecode' && options.cueType === 'gototime',
        useVariables: true,
    },
    TC_GoToTarget: {
        type: 'textinput',
        label: 'Timecode',
        id: 'timecodeTarget',
        default: '',
        isVisible: (options) => (options.timeType === 'timecode' && options.cueType === 'gototime') || (options.tagType === 'TC' && options.cueType === 'gototag'),
        regex: '/^([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})$/',
        useVariables: true,
    },
    /* ------------------------------- GO TO TIME ------------------------------- */
    TIME_GoToTarget: {
        type: 'textinput',
        label: 'Seconds',
        id: 'timeTarget',
        default: '0',
        isVisible: (options) => options.timeType === 'seconds' && options.cueType === 'gototime',
        regex: '/^\\d*(\\.\\d+)?$/',
        useVariables: true,
    },

    /* ------------------------------- GO TO FRAME ------------------------------ */
    FRAME_GoToTarget: {
        type: 'textinput',
        label: 'Frames',
        id: 'frameTarget',
        default: '0',
        isVisible: (options) => options.timeType === 'frame' && options.cueType === 'gototime',
        regex: '/^\\d*(\\.\\d+)?$/',
        useVariables: true,
    },

    /* ------------------------------ GO TO SECTION ----------------------------- */
    SECTION_GoToTarget: {
        type: 'textinput',
        label: 'Section',
        id: 'sectionTarget',
        default: '0',
        isVisible: (options) => options.cueType === 'gotosection',
        regex: '/^\\d*(\\.\\d+)?$/',
        tooltip: 'WARNING: Sections are 0-indexed, and dynamically change. Splitting sections will change the index of the section you are looking for.',
        useVariables: true,
    },

    /* ------------------------------- GO TO TRACK ------------------------------ */
    TRACK_GoToTarget: {
        type: 'textinput',
        label: 'Track',
        id: 'trackTarget',
        default: '0',
        isVisible: (options) => options.cueType === 'gototrack',
        regex: '/.*/',
        useVariables: true,
    },



    /* ------------------------------ GO TO TARGET ------------------------------ */

    // GENERIC GO TO TARGET
    GenericGoToTarget: {
        type: 'textinput',
        label: 'Target',
        id: 'target',
        default: '',
        // regex: '/.*/'
    },
}