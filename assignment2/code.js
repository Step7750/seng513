function getMostFrequent(arr) {
    const freq = {};

    for (const i of arr) {
        freq[i] = freq[i] ? freq[i] + 1 : 1;
    }

    return Object.keys(freq).map((key) => [key, freq[key]])
        .sort((a, b) => b[1] === a[1] ? a[0].localeCompare(b[0]) : b[1] - a[1]);
}

function getStats(txt) {
    txt = txt.toLowerCase();
    const orig = txt;
    txt = txt.replace(/[^a-zA-Z0-9]/g, ' ');

    const words = txt.split(' ').filter((s) => s.length > 0);
    const lines = orig.split('\n');
    const nonEmptyLines = lines.filter((s) => s.trim().length > 0);

    const palindromes = words.filter((s) => s.length > 1 && s.split('').reverse().join('') === s);
    const longestWords = Array.from(new Set(words))
        .sort((a, b) => b.length === a.length ? a.localeCompare(b) : b.length - a.length);

    const maxLineLength = lines.reduce((acc, val) => {
        if (val.length > acc) acc = val.length;

        return acc;
    }, 0);

    const freqWords = getMostFrequent(words).map((w) => `${w[0]}(${w[1]})`);

    let averageWordLength = words.reduce((acc, val) => acc += val.length, 0);
    averageWordLength /= words.length;

    return {
        nChars: orig.length,
        nWords: words.length,
        nLines: lines.length,
        nonEmptyLines: nonEmptyLines.length,
        averageWordLength: averageWordLength,
        maxLineLength: maxLineLength,
        palindromes: palindromes,
        longestWords: longestWords.slice(0, 10),
        mostFrequentWords: freqWords.slice(0, 10)
    };
}
