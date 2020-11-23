import {Enums} from '../types'


const token: string = 'YOUR BOT TOKEN'

const chordMajorList: string[] = [
    'C\nДо-Мажор',
    'D\nРе-Мажор',
    'E\nМи-Мажор',
    'F\nФа-Мажор',
    'G\nСоль-Мажор',
    'A\nЛя-Мажор',
    'B\nСи-Мажор',
]

const chordMinorList: string[] = [
    'Cm\nДо-Минор',
    'Dm\nРе-Минор',
    'Em\nМи-Минор',
    'Fm\nФа-Минор',
    'Gm\nСоль-Минор',
    'Am\nЛя-Минор',
    'Bm\nСи-Минор',
]

const octaveList: string[] = [
    'Большая октава',
    'Малая октава',
    'Первая октава',
    'Вторая октава',
    'Третья октава',
]

const allChordList: string[] = [...chordMajorList, ...chordMinorList]

export const getRandomChord = (
    chordList: string[],
    getOctave: ((octaveList: string[]) => string) | null,
): string => {
    const randomNumber: number = Math.round(Math.random() * (chordList.length - 1))
    const chord: string = chordList[randomNumber]

    let result: string = chord

    if (getOctave) {
        result = getOctave(octaveList) + '\n\n' + chord
    }

    return result
}

export const getRandomOctave = (): string => {
    const randomNumber: number = Math.round(Math.random() * (octaveList.length - 1))
    const octave: string = octaveList[randomNumber]

    return octave
}

export const getChordList = (type: Enums.ChordType): string[] => {
    if (type === 'Major') {
        return chordMajorList
    }

    if (type === 'Minor') {
        return chordMinorList
    }

    return allChordList
}
