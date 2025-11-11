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
    language: string;
    userId: string;
    timed: TimedLyrics;

}

