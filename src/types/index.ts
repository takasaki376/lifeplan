export type colorScheme = 'light' | 'dark' | 'auto';

export type FamilyMember = {
  id?: string | null; // FirestoreのドキュメントID（更新時に使用）
  name: string;
  birthDate: Date | null; // 生年月日 (YYYY-MM-DD形式)
  relation: string; // 関係 (例: 父, 母, 子供)
};

export type Event = {
  id?: string | null; // FirestoreのドキュメントID（更新時に使用）
  title: string; // イベント名
  date: Date | null; // 日付 (ISO形式: YYYY-MM-DD)
  cost: number; // 費用
};

export type ExpenseCategory = {
  [category: string]: number; // カテゴリ名をキーにした金額
};

export type Expense = {
  id?: string; // Firestore ドキュメント ID
  date: Date; // 支出の日付
  categories: ExpenseCategory; // カテゴリごとの支出金額
};

export type ApiExpense = {
  id?: string;
  date: string; // サーバー側では ISO 8601 の文字列形式で扱う
  categories: ExpenseCategory;
};

export type Asset = {
  id: string;
  type: 'cash' | 'deposit' | 'real_estate' | 'stocks' | 'other';
  details?: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Debt = {
  id?: string; // Firestore ドキュメントID（存在する場合のみ）
  name: string; // 債務名（例: 住宅ローン）
  balance: number; // 残高
  interestRate: number; // 金利 (%)
  dueDate: Date | null; // 返済期日 (ISO8601形式の文字列)
  recordedDate: Date | null; // 登録時点の日付 (ISO8601形式の文字列)
  createdAt?: string; // データ作成日時 (ISO8601形式の文字列, Firestore自動生成)
  updatedAt?: string; // データ更新日時 (ISO8601形式の文字列, Firestore自動生成)
};
