/**
 * 文字列からホワイトスペースを除外し、カンマ区切りで配列にする
 * @param str 分割したい文字列
 * @returns 分割後の文字配列
 */
export function toSplitArray(str: string): string[] {
  const strExcludedFromSpaces = str.replace(/\s|　/g, "");
  const splitArray = strExcludedFromSpaces.split(",");

  return splitArray;
}
