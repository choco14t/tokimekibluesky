import {parseISO} from "date-fns";

export const soundsMap = new Map();

soundsMap.set('sound1', new Audio('https://zkcpydmrzurbuoebrhqu.supabase.co/storage/v1/object/public/sounds/sound1.mp3'))
    .set('sound2', new Audio('https://zkcpydmrzurbuoebrhqu.supabase.co/storage/v1/object/public/sounds/sound2.mp3'))
    .set('sound3', new Audio('https://zkcpydmrzurbuoebrhqu.supabase.co/storage/v1/object/public/sounds/sound3.mp3'))
    .set('sound4', new Audio('https://zkcpydmrzurbuoebrhqu.supabase.co/storage/v1/object/public/sounds/sound4.mp3'))
    .set('sound5', new Audio('https://zkcpydmrzurbuoebrhqu.supabase.co/storage/v1/object/public/sounds/sound5.mp3'))
    .set('notification1', new Audio('https://zkcpydmrzurbuoebrhqu.supabase.co/storage/v1/object/public/sounds/notification-1.ogg'))
    .set('notification2', new Audio('https://zkcpydmrzurbuoebrhqu.supabase.co/storage/v1/object/public/sounds/notification-2.ogg'))
    .set('notification3', new Audio('https://zkcpydmrzurbuoebrhqu.supabase.co/storage/v1/object/public/sounds/notification-3.ogg'));

export function playSound(indexedAt: string, lastRefresh: string, playSound: string) {
    try {
        if (indexedAt && parseISO(indexedAt).getTime() > parseISO(lastRefresh).getTime()) {
            const sound = soundsMap.get(playSound);
            sound.volume = 0.5;
            sound.play();
        }
    } catch (e) {
        console.error(e);
    }
}

export function instantPlaySound(playSound = 'notification1') {
    try {
        const sound = soundsMap.get(playSound);
        sound.volume = 0.5;
        sound.play();
    } catch (e) {
        console.error(e);
    }
}