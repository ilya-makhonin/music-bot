import TelegramBot from 'node-telegram-bot-api'
import {
    Message,
} from 'node-telegram-bot-api'
import {
    getChordList,
    getRandomChord,
    getRandomOctave,
} from './common/Util'
import {
    token,
    options,
} from './common/Config'
import { Enums } from './types'


const bot: TelegramBot = new TelegramBot(token, options)

let cache: Enums.ICache = {
    interval: undefined,
    period: 2000,
    chordType: 'Major',
    isUseOctave: false,
    isSending: false,
}


bot.onText(/\/start/, (msg: Message, match: RegExpExecArray) => {
    if (cache.isSending) return

    const chatId: number = msg.chat.id
    const chordList: string[] = getChordList(cache.chordType)

    cache.isSending = true
    
    cache.interval = setInterval(
        () => bot.sendMessage(chatId, getRandomChord(chordList, cache.isUseOctave ? getRandomOctave : null)),
        cache.period,
    ) 
})

bot.onText(/\/stop/, (msg: Message, match: RegExpExecArray) => {
    cache.isSending = false
    clearInterval(cache.interval)
})

bot.onText(/\/tempo ([0-9]{4,5})/, (msg: Message, match: RegExpExecArray) => {
    if (cache.isSending) return
    const chatId: number = msg.chat.id
    cache.period = match[1] ? parseInt(match[1]) : cache.period

    bot.sendMessage(chatId, 'Темп ' + cache.period.toString())
})

bot.onText(/\/chord (.+)/, (msg: Message, match: RegExpExecArray) => {
    if (cache.isSending) return
    const chatId: number = msg.chat.id
    cache.chordType = match[1] === 'all'
        ? 'All'
            : match[1] === 'minor'
                ? 'Minor'
                    : 'Major'

    bot.sendMessage(chatId, `Установлены ${cache.chordType === 'All' ? 'все' : cache.chordType === 'Major' ? 'мажорные' : 'минорные'} аккорды`)
})

bot.onText(/\/octave/, (msg: Message, match: RegExpExecArray) => {
    if (cache.isSending) return
    const chatId: number = msg.chat.id
    cache.isUseOctave = !cache.isUseOctave

    bot.sendMessage(chatId, cache.isUseOctave ? 'Используем октавы' : 'Октавы отключены')
})

bot.on('polling_error', (error: Error) => {
    console.log(error)
})
