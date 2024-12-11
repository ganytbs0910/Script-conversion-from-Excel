const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')

const characterNameMap: { [key: string]: string } = {
  'シェリー': 'shelly',
  'ニタ': 'nita', 
  'コルト': 'colt',
  'ブル': 'bull',
  'ブロック': 'brock',
  'エルプリモ': 'elPrimo',
  'バーリー': 'barley',
  'ポコ': 'poco',
  'ローサ': 'rosa',
  'ジェシー': 'jessie',
  'ダイナマイク': 'dynamike',
  'ティック': 'tick',
  '8ビット': 'eightBit',
  'リコ': 'rico',
  'ダリル': 'darryl',
  'ペニー': 'penny',
  'カール': 'carl',
  'ジャッキー': 'jacky',
  'ガス': 'gus',
  'ボウ': 'bo',
  'Emz': 'emz',
  'ストゥー': 'stu',
  'エリザベス': 'piper',
  'パム': 'pam',
  'フランケン': 'frank',
  'ビビ': 'bibi',
  'ビー': 'bea',
  'ナーニ': 'nani',
  'エドガー': 'edgar',
  'グリフ': 'griff',
  'グロム': 'grom',
  'ボニー': 'bonnie',
  'ゲイル': 'gale',
  'コレット': 'colette',
  'ベル': 'belle',
  'アッシュ': 'ash',
  'ローラ': 'lola',
  'サム': 'sam',
  'マンディ': 'mandy',
  'メイジー': 'maisie',
  'ハンク': 'hank',
  'パール': 'pearl',
  'ラリー&ローリー': 'larryandLawrie',
  'アンジェロ': 'angelo',
  'ベリー': 'berry',
  'シェイド': 'shade',
  'モーティス': 'mortis',
  'タラ': 'tara',
  'ジーン': 'gene',
  'MAX': 'max',
  'ミスターP': 'mrp',
  'スプラウト': 'sprout',
  'バイロン': 'byron',
  'スクウィーク': 'squeak',
  'ルー': 'lou',
  'ラフス': 'ruffs',
  'バズ': 'buzz',
  'ファング': 'fang',
  'イヴ': 'eve',
  'ジャネット': 'janet',
  'オーティス': 'otis',
  'バスター': 'buster',
  'グレイ': 'gray',
  'R-T': 'rt',
  'ウィロー': 'willow',
  'ダグ': 'doug',
  'チャック': 'chuck',
  'チャーリー': 'charlie',
  'ミコ': 'mico',
  'メロディー': 'melodie',
  'リリー': 'lily',
  'クランシー': 'clancy',
  'モー': 'moe',
  'ジュジュ': 'juju',
  'スパイク': 'spike',
  'クロウ': 'crow',
  'レオン': 'leon',
  'サンディ': 'sandy',
  'アンバー': 'amber',
  'メグ': 'meg',
  'サージ': 'surge',
  'チェスター': 'chester',
  'コーデリアス': 'cordelius',
  'キット': 'kit',
  'ドラコ': 'draco',
  'ケンジ': 'kenji'
}

try {
  // CSVファイルを読み込む
  const csvData = fs.readFileSync('./BrawlCharacter.csv', 'utf-8')

  // CSVをパースする
  const records = parse(csvData, {
    skipEmptyLines: true,
    fromLine: 1,
    toLine: 87
  })

  // ヘッダー行（キャラクター名）を取得 - 最初の列は無視
  const headers = records[0].slice(1).filter((col: string) => col.trim() !== '')

  // charactersディレクトリが存在しない場合は作成
  const outputDir = path.join(process.cwd(), 'characters')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  // 各キャラクターのデータを生成（1行目のヘッダーをスキップ）
  for (let i = 1; i < records.length; i++) {
    const row = records[i]
    if (!row[0] || !row[0].trim()) continue // 空行をスキップ

    // キャラクター名から番号を除去 (例: "1. ブル" → "ブル")
    const currentCharacter = row[0].replace(/^\d+\.\s*/, '').trim()
    if (!currentCharacter) continue

    const compatibilityScores: { [key: string]: number } = {}

    // 他のキャラクターとの相性スコアを取得（最初の列をスキップ）
    headers.forEach((otherCharacter: string, index: number) => {
      if (otherCharacter !== currentCharacter) {
        const score = parseInt(row[index + 1])
        if (!isNaN(score)) {
          compatibilityScores[otherCharacter] = score
        }
      }
    })

    // キャラクターデータを作成
    const characterData = {
      id: i,
      name: currentCharacter,
      compatibilityScores,
      explanation: {}
    }

    // 英語名のファイル名を取得
    const fileName = characterNameMap[currentCharacter] || currentCharacter.toLowerCase()
    const varName = `${fileName}Data`

    // TypeScriptファイルとして出力
    const outputContent = `import { CharacterCompatibility } from '../types/types'

export const ${varName}: CharacterCompatibility = ${JSON.stringify(characterData, null, 2)}`

    const outputPath = path.join(outputDir, `${fileName}Data.ts`)
    fs.writeFileSync(outputPath, outputContent, 'utf-8')
    console.log(`Generated: ${currentCharacter} (${fileName}Data.ts)`)
  }

  console.log('すべてのキャラクターデータの生成が完了しました！')
} catch (error) {
  console.error('エラーが発生しました:', error)
}