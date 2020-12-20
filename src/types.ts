export namespace Enums {
    export type ChordType = (
        | 'Major'
        | 'Minor'
        | 'All'
    )

    export interface ICache {
        interval: NodeJS.Timeout | undefined,
        period: number,
        chordType: ChordType,
        isUseOctave: boolean,
        isSending: boolean,
    }
}
