export const PLAY_MODES = [
    { id: 'play', label: 'Play' },
    { id: 'playSection', label: 'Play Section' },
    { id: 'loop', label: 'Loop Section' },
    { id: 'stop', label: 'Stop' },
]

export const TRANSPORT_COMMANDS = [
    { id: 'nextsection', label: 'Next Section' },
    { id: 'nexttrack', label: 'Next Track' },
    { id: 'prevsection', label: 'Previous Section' },
    { id: 'prevtrack', label: 'Previous Track' },
    { id: 'returntostart', label: 'Return to Start' },
]

export const CUE_TYPES = [
    { id: 'gototag', label: 'Tag' },
    { id: 'gotonote', label: 'Note' },
    { id: 'gototime', label: 'Time' },
    // { id: 'gotoframe', label: 'Frame' },
    { id: 'gotosection', label: 'Section' },
    // { id: 'gototrack', label: 'Track' },
]

export const TAG_TYPES = [
    { id: 'CUE', label: 'CUE' },
    { id: 'MIDI', label: 'MIDI' },
    { id: 'TC', label: 'TC' },
]

export const TIME_TYPES = [
    { id: 'timecode', label: 'Timecode' },
    { id: 'seconds', label: 'Seconds' },
    { id: 'frame', label: 'Frame' },
]