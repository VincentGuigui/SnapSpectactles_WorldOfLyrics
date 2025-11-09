// Represents a single timed lyric line
class TimedLine {
    begin: number;
    content: string;
    end: number;

    constructor(begin: number, content: string, end: number) {
        this.begin = begin;
        this.content = content;
        this.end = end;
    }
}

// Represents the "timed" property containing an array of lines
class TimedLyrics {
    line: TimedLine[];

    constructor(line: TimedLine[]) {
        this.line = line;
    }
}

// Main class for the entire lyrics JSON object
export class LyricsData {
    duration_seconds: number;
    file_generated_timestamp: number;
    id: number;
    language: string;
    lyrics_created_timestamp: number;
    plain: string;
    songTitle: string;
    timed: TimedLyrics;

    constructor(
        duration_seconds: number,
        file_generated_timestamp: number,
        id: number,
        language: string,
        lyrics_created_timestamp: number,
        plain: string,
        songTitle: string,
        timed: TimedLyrics
    ) {
        this.duration_seconds = duration_seconds;
        this.file_generated_timestamp = file_generated_timestamp;
        this.id = id;
        this.language = language;
        this.lyrics_created_timestamp = lyrics_created_timestamp;
        this.plain = plain;
        this.songTitle = songTitle;
        this.timed = timed;
    }
}