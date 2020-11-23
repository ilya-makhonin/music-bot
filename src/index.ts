import TelegramBot from 'node-telegram-bot-api'
import {
    ConstructorOptions,
    Message,
} from 'node-telegram-bot-api'
import {
    getChordList,
    getRandomChord,
    getRandomOctave,
} from './common/Util'
import { Enums } from './types'


const token: string = '...'
const options: ConstructorOptions = {
    polling: true,
}

const bot: TelegramBot = new TelegramBot(token, options)

let interval: NodeJS.Timeout | undefined
let period: number = 2000
let chordType: Enums.ChordType = 'Major'
let isUseOctave: boolean = false
let isSending: boolean = false


bot.onText(/\/start/, (msg: Message, match: RegExpExecArray) => {
    if (isSending) return

    const chatId: number = msg.chat.id
    const chordList: string[] = getChordList(chordType)

    isSending = true
    
    interval = setInterval(
        () => bot.sendMessage(chatId, getRandomChord(chordList, isUseOctave ? getRandomOctave : null)),
        period,
    ) 
})

bot.onText(/\/stop/, (msg: Message, match: RegExpExecArray) => {
    isSending = false
    clearInterval(interval)
})

bot.onText(/\/tempo ([0-9]{4,5})/, (msg: Message, match: RegExpExecArray) => {
    if (isSending) return
    const chatId: number = msg.chat.id
    period = match[1] ? parseInt(match[1]) : period

    bot.sendMessage(chatId, 'Темп ' + period.toString())
})

bot.onText(/\/chord (.+)/, (msg: Message, match: RegExpExecArray) => {
    if (isSending) return
    const chatId: number = msg.chat.id
    chordType = match[1] === 'all'
        ? 'All'
            : match[1] === 'minor'
                ? 'Minor'
                    : 'Major'

    bot.sendMessage(chatId, `Установлены ${chordType === 'All' ? 'все' : chordType === 'Major' ? 'мажорные' : 'минорные'} аккорды`)
})

bot.onText(/\/octave/, (msg: Message, match: RegExpExecArray) => {
    if (isSending) return
    const chatId: number = msg.chat.id
    isUseOctave = !isUseOctave

    bot.sendMessage(chatId, isUseOctave ? 'Используем октавы' : 'Октавы отключены')
})

bot.on('polling_error', (error: Error) => {
    console.log(error)
})
