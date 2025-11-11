import {LyricsData} from '../Scripts/LyricsData'
import {Song} from '../Scripts/Song'

@component 
export class LightInTheNight extends Song {
    @input 
    title: "light in the night"
    @input
    cover: Material
    lyrics: LyricsData = {
    "duration_seconds": 225,
    "language": "en",
    "userId": "VincentGuigui",
    "timed": {
        "line": []
    } 
}
}
