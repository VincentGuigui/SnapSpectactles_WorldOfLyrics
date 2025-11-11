import {LyricsData} from '../Scripts/LyricsData'
import {Song} from '../Scripts/Song'

@component 
export class SongAndLyrics extends Song {
    @input 
    title: "Flying through the sky"
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
