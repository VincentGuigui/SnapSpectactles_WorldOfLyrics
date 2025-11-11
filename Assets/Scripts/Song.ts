import { LyricsData } from "./LyricsData"

@component
export class Song extends BaseScriptComponent{
    @input 
    title: string
    @input 
    cover: Material
    @input 
    @allowUndefined
    track: AudioTrackAsset | undefined
 
    lyrics: LyricsData
}