import { LyricsData } from "./LyricsData"

@component
export class Song extends BaseScriptComponent{
    @input 
    title: string
    @input 
    cover: Material
    lyrics: LyricsData
}