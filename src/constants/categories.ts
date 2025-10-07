export const categories = {
  DEV_LOG: { displayName: '開発記録', order: 1 },
  STUDY_LOG: { displayName: '勉強ログ', order: 2 },
} as const

export const UNCLASSIFIED_CATEGORY = {
  displayName: '未分類',
  order: 999,
} as const

export type CategoryID = keyof typeof categories
