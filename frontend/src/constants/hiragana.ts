export interface HiraganaChar {
    char: string;
    romaji: string;
    type: 'vowel' | 'consonant' | 'combo';
}

export const HIRAGANA_DATA: HiraganaChar[] = [
    { char: 'あ', romaji: 'a', type: 'vowel' }, { char: 'い', romaji: 'i', type: 'vowel' }, { char: 'う', romaji: 'u', type: 'vowel' }, { char: 'え', romaji: 'e', type: 'vowel' }, { char: 'お', romaji: 'o', type: 'vowel' },
    { char: 'か', romaji: 'ka', type: 'consonant' }, { char: 'き', romaji: 'ki', type: 'consonant' }, { char: 'く', romaji: 'ku', type: 'consonant' }, { char: 'け', romaji: 'ke', type: 'consonant' }, { char: 'こ', romaji: 'ko', type: 'consonant' },
    { char: 'さ', romaji: 'sa', type: 'consonant' }, { char: 'し', romaji: 'shi', type: 'consonant' }, { char: 'す', romaji: 'su', type: 'consonant' }, { char: 'せ', romaji: 'se', type: 'consonant' }, { char: 'そ', romaji: 'so', type: 'consonant' },
    { char: 'た', romaji: 'ta', type: 'consonant' }, { char: 'ち', romaji: 'chi', type: 'consonant' }, { char: 'つ', romaji: 'tsu', type: 'consonant' }, { char: 'て', romaji: 'te', type: 'consonant' }, { char: 'と', romaji: 'to', type: 'consonant' },
    { char: 'な', romaji: 'na', type: 'consonant' }, { char: 'に', romaji: 'ni', type: 'consonant' }, { char: 'ぬ', romaji: 'nu', type: 'consonant' }, { char: 'ね', romaji: 'ne', type: 'consonant' }, { char: 'の', romaji: 'no', type: 'consonant' },
    { char: 'は', romaji: 'ha', type: 'consonant' }, { char: 'ひ', romaji: 'hi', type: 'consonant' }, { char: 'ふ', romaji: 'fu', type: 'consonant' }, { char: 'へ', romaji: 'he', type: 'consonant' }, { char: 'ほ', romaji: 'ho', type: 'consonant' },
    { char: 'ま', romaji: 'ma', type: 'consonant' }, { char: 'み', romaji: 'mi', type: 'consonant' }, { char: 'む', romaji: 'mu', type: 'consonant' }, { char: 'め', romaji: 'me', type: 'consonant' }, { char: 'も', romaji: 'mo', type: 'consonant' },
    { char: 'や', romaji: 'ya', type: 'consonant' }, { char: 'ゆ', romaji: 'yu', type: 'consonant' }, { char: 'よ', romaji: 'yo', type: 'consonant' },
    { char: 'ら', romaji: 'ra', type: 'consonant' }, { char: 'り', romaji: 'ri', type: 'consonant' }, { char: 'る', romaji: 'ru', type: 'consonant' }, { char: 'れ', romaji: 're', type: 'consonant' }, { char: 'ろ', romaji: 'ro', type: 'consonant' },
    { char: 'わ', romaji: 'wa', type: 'consonant' }, { char: 'を', romaji: 'wo', type: 'consonant' },
    { char: 'ん', romaji: 'n', type: 'consonant' },
];

export const ALL_VALID_CHARS = HIRAGANA_DATA.filter(item => item.char !== '');
