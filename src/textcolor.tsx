export default function getContrastColor(hexColor: string): 'black' | 'white' {
    // 1. HEXからRGBに変換
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    // 2. 輝度の計算 (0〜255)
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b);

    // 3. しきい値（128）を基準に白か黒を返す
    return luminance > 128 ? 'black' : 'white';
};
