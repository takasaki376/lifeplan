export type FamilyMember = {
  id?: string | null;
  name: string;
  birthDate: Date | null; // 生年月日 (YYYY-MM-DD形式)
  relation: string; // 関係 (例: 父, 母, 子供)
};

export type Event = {
  id?: string | null; // 一意のID
  title: string; // イベント名
  date: Date | null; // 日付 (ISO形式: YYYY-MM-DD)
  cost: number; // 費用
};
