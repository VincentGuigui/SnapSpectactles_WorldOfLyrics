import {LyricsData} from '../Scripts/LyricsData'
import {Song} from '../Scripts/Song'

@component 
export class SongAndLyrics extends Song {
    @input 
    title: "Light in the Night"
    @input
    cover: Material
    lyrics: LyricsData  = {
    "duration_seconds": 225,
    "language": "en",
    "userId": "VincentGuigui",
    "timed": {
        "line": []
    }
}
}
