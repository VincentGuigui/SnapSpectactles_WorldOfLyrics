import {LyricsData} from '../Scripts/LyricsData'
import {Song} from '../Scripts/Song'

@component 
export class SongAndLyrics extends Song {
    @input 
    title: "Crowded City"
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
