import {LyricsData} from '../Scripts/LyricsData'
import {Song} from '../Scripts/Song'

@component 
export class LightInTheNight extends Song {
    @input 
    title: "Birthday Song"
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
