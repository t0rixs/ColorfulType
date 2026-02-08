// ローマ字→ひらがな変換テーブル（構造化）
export const ROMAJI_MAP: { [key: string]: string } = {
    'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
    'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
    'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
    'sa': 'さ', 'si': 'し', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
    'za': 'ざ', 'zi': 'じ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
    'ta': 'た', 'ti': 'ち', 'chi': 'ち', 'tu': 'つ', 'tsu': 'つ', 'te': 'て', 'to': 'と',
    'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
    'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
    'ha': 'は', 'hi': 'ひ', 'hu': 'ふ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
    'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
    'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
    'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
    'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
    'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
    'wa': 'わ', 'wo': 'を',
    'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
    'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
    'sha': 'しゃ', 'sya': 'しゃ', 'shu': 'しゅ', 'syu': 'しゅ', 'sho': 'しょ', 'syo': 'しょ',
    'ja': 'じゃ', 'zya': 'じゃ', 'ju': 'じゅ', 'zyu': 'じゅ', 'jo': 'じょ', 'zyo': 'じょ',
    'cha': 'ちゃ', 'tya': 'ちゃ', 'chu': 'ちゅ', 'tyu': 'ちゅ', 'cho': 'ちょ', 'tyo': 'ちょ',
    'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
    'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
    'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
    'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
    'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
    'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',
    'xa': 'ぁ', 'xi': 'ぃ', 'xu': 'ぅ', 'xe': 'ぇ', 'xo': 'ぉ',
    'la': 'ぁ', 'li': 'ぃ', 'lu': 'ぅ', 'le': 'ぇ', 'lo': 'ぉ',
    'xya': 'ゃ', 'lya': 'ゃ', 'xyu': 'ゅ', 'lyu': 'ゅ', 'xyo': 'ょ', 'lyo': 'ょ',
    'xtu': 'っ', 'ltu': 'っ', 'xtsu': 'っ', 'ltsu': 'っ',
};

// ローマ字をひらがなに変換する関数
export default function convertRomajiToHiragana(romaji: string): string {
    let result = '';
    let i = 0;
    
    while (i < romaji.length) {
        let matched = false;
        
        // nの特別処理
        if (romaji[i].toLowerCase() === 'n') {
            if (i + 1 < romaji.length) {
                const nextChar = romaji[i + 1].toLowerCase();
                // nnの場合は「ん」に変換（2文字進める）
                if (nextChar === 'n') {
                    result += 'ん';
                    i += 2;
                    matched = true;
                }
                // 次の文字が母音やyで始まる場合は、na/ni/nu/ne/no/nya/nyu/nyoなどの可能性がある
                else if (/[aeiouy]/.test(nextChar)) {
                    // 2文字や3文字のマッチングを試行
                    for (let len = 3; len >= 2; len--) {
                        if (i + len <= romaji.length) {
                            const substr = romaji.substring(i, i + len).toLowerCase();
                            if (ROMAJI_MAP[substr]) {
                                result += ROMAJI_MAP[substr];
                                i += len;
                                matched = true;
                                break;
                            }
                        }
                    }
                } else {
                    // 次の文字が子音の場合は「ん」に変換
                    result += 'ん';
                    i += 1;
                    matched = true;
                }
            } else {
                // 最後の文字がnの場合は「ん」に変換
                result += 'ん';
                i += 1;
                matched = true;
            }
        }
        
        if (!matched) {
            // 3文字、2文字、1文字の順でマッチングを試行
            for (let len = 3; len >= 1; len--) {
                if (i + len <= romaji.length) {
                    const substr = romaji.substring(i, i + len).toLowerCase();
                    if (ROMAJI_MAP[substr]) {
                        result += ROMAJI_MAP[substr];
                        i += len;
                        matched = true;
                        break;
                    }
                }
            }
        }
        
        if (!matched) {
            // マッチしない場合はそのまま追加（入力中のローマ字の可能性）
            result += romaji[i];
            i++;
        }
    }
    
    return result;
};

// バッファを逐次的に処理して、確定した部分を変換済みに移動
export function processBufferIncrementally(buffer: string, target: string, convertedSoFar: string): { isValid: boolean; newConverted: string; remainingBuffer: string } {
    const bufferLower = buffer.toLowerCase();
    
    // バッファが空の場合は有効
    if (bufferLower.length === 0) {
        return { isValid: true, newConverted: convertedSoFar, remainingBuffer: '' };
    }
    
    // 1. 完全一致チェック：バッファが辞書に存在し、変換結果が目標と一致するか
    if (ROMAJI_MAP[bufferLower]) {
        const converted = convertedSoFar + ROMAJI_MAP[bufferLower];
        if (target.startsWith(converted)) {
            return { isValid: true, newConverted: converted, remainingBuffer: '' };
        }
    }
    
    // 2. 前方一致チェック：バッファで始まるキーが存在するか（途中の入力の可能性）
    let longestMatch = '';
    let longestMatchHiragana = '';
    
    for (const key in ROMAJI_MAP) {
        if (key.startsWith(bufferLower)) {
            const converted = convertedSoFar + ROMAJI_MAP[key];
            if (target.startsWith(converted)) {
                // より長いマッチを優先
                if (key.length > longestMatch.length) {
                    longestMatch = key;
                    longestMatchHiragana = ROMAJI_MAP[key];
                }
            }
        }
    }
    
    // 完全一致が見つかった場合
    if (longestMatch === bufferLower) {
        return { isValid: true, newConverted: convertedSoFar + longestMatchHiragana, remainingBuffer: '' };
    }
    
    // 前方一致が見つかった場合（途中の入力）
    if (longestMatch.length > bufferLower.length) {
        return { isValid: true, newConverted: convertedSoFar, remainingBuffer: bufferLower };
    }
    
    // 3. 促音（っ）の処理：同じ子音が2回連続（nn以外）
    if (bufferLower.length >= 2) {
        const firstChar = bufferLower[0];
        const secondChar = bufferLower[1];
        if (firstChar === secondChar && firstChar !== 'n') {
            // 最初の1文字を「っ」として処理
            const remainingBuffer = bufferLower.substring(1);
            const convertedWithTsu = convertedSoFar + 'っ';
            const result = processBufferIncrementally(remainingBuffer, target, convertedWithTsu);
            if (result.isValid) {
                return result;
            }
        }
    }
    
    // 4. 撥音（ん）の処理
    if (bufferLower === 'n') {
        // nは「ん」になる可能性がある
        const convertedWithN = convertedSoFar + 'ん';
        if (target.startsWith(convertedWithN)) {
            return { isValid: true, newConverted: convertedWithN, remainingBuffer: '' };
        }
        // na, ni, nu, ne, no, nya, nyu, nyoなどの可能性がある（前方一致）
        const nKeys = ['na', 'ni', 'nu', 'ne', 'no', 'nya', 'nyu', 'nyo'];
        for (const key of nKeys) {
            if (key.startsWith(bufferLower)) {
                const converted = convertedSoFar + ROMAJI_MAP[key];
                if (target.startsWith(converted)) {
                    return { isValid: true, newConverted: convertedSoFar, remainingBuffer: bufferLower };
                }
            }
        }
    } else if (bufferLower.startsWith('n') && bufferLower.length > 1) {
        const nextChar = bufferLower[1];
        // 次の文字が母音やyの場合は、na/ni/nu/ne/no/nya/nyu/nyoなどの可能性
        if (/[aeiouy]/.test(nextChar)) {
            for (const key in ROMAJI_MAP) {
                if (key.startsWith(bufferLower)) {
                    const converted = convertedSoFar + ROMAJI_MAP[key];
                    if (target.startsWith(converted)) {
                        if (key === bufferLower) {
                            return { isValid: true, newConverted: converted, remainingBuffer: '' };
                        } else {
                            return { isValid: true, newConverted: convertedSoFar, remainingBuffer: bufferLower };
                        }
                    }
                }
            }
        } else if (nextChar !== 'n') {
            // 次の文字が子音（n以外）の場合は「ん」として確定
            const remainingBuffer = bufferLower.substring(1);
            const convertedWithN = convertedSoFar + 'ん';
            const result = processBufferIncrementally(remainingBuffer, target, convertedWithN);
            if (result.isValid) {
                return result;
            }
        }
    }
    
    return { isValid: false, newConverted: convertedSoFar, remainingBuffer: bufferLower };
}
