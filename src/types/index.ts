import { Timestamp } from 'firebase-admin/firestore';

export type colorScheme = 'light' | 'dark' | 'auto';

export type Family = {
  id?: string | null; // FirestoreのドキュメントID（更新時に使用）
  name: string;
  birthDate: Date | null; // 生年月日 (YYYY-MM-DD形式)
  relation: string; // 関係 (例: 父, 母, 子供)
};
export type ApiFamily = {
  id?: string | null; // FirestoreのドキュメントID（更新時に使用）
  name: string;
  birthDate: string | Timestamp; // 生年月日 (YYYY-MM-DD形式)
  relation: string; // 関係 (例: 父, 母, 子供)
};

export type Event = {
  id?: string | null; // FirestoreのドキュメントID（更新時に使用）
  title: string; // イベント名
  date: Date | null; // 日付 (ISO形式: YYYY-MM-DD)
  cost: number; // 費用
};

// ---------------------
// 収入
export type Income = {
  id?: string; // Firestore ドキュメント ID
  familyId: string; // 家族情報との紐づけ
  name: string; //収入の名称
  income: number; //収入額
  startAge: number; //開始年齢
  endAge: number; //修了年齢
  createdAt?: Date;
  updatedAt?: Date;
};
export type ApiIncome = {
  id?: string; // Firestore ドキュメント ID
  name: string; //収入の名称
  income: number; //収入額
  startAge: number; //開始年齢
  endAge: number; //修了年齢
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
};
// ---------------------
// 支出
export type ExpenseCategory = {
  [category: string]: number; // カテゴリ名をキーにした金額
};

export type Expense = {
  id?: string; // Firestore ドキュメント ID
  recordedDate: Date; // 支出の日付
  categories: ExpenseCategory; // カテゴリごとの支出金額
};

export type ApiExpense = {
  id?: string;
  recordedDate: string | Timestamp; // サーバー側では ISO 8601 の文字列形式で扱う
  categories: ExpenseCategory;
};

// ---------------------
// 資産
export type Asset = {
  id?: string;
  type: 'cash' | 'deposit' | 'real_estate' | 'stocks' | 'other';
  details?: string;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
};

// ---------------------
// 債務
export type Debt = {
  id?: string; // Firestore ドキュメントID（存在する場合のみ）
  name: string; // 債務名（例: 住宅ローン）
  balance: number; // 残高
  interestRate: number; // 金利 (%)
  dueDate: Date | null; // 返済期日 (ISO8601形式の文字列)
  monthlyPayment: number; // 月額返済金額
  recordedDate: Date; // 登録時点の日付 (ISO8601形式の文字列)
  createdAt?: Date; // データ作成日時 (ISO8601形式の文字列, Firestore自動生成)
  updatedAt?: Date; // データ更新日時 (ISO8601形式の文字列, Firestore自動生成)
};

export type ApiDebt = {
  id?: string; // Firestore ドキュメントID（存在する場合のみ）
  name: string; // 債務名（例: 住宅ローン）
  balance: number; // 残高
  interestRate: number; // 金利 (%)
  dueDate: string; // 返済期日 (ISO8601形式の文字列)
  monthlyPayment: number; // 月額返済金額
  recordedDate: string; // 登録時点の日付 (ISO8601形式の文字列)
  createdAt?: string; // データ作成日時 (ISO8601形式の文字列, Firestore自動生成)
  updatedAt?: string; // データ更新日時 (ISO8601形式の文字列, Firestore自動生成)
};

export type CalculationResult = {
  totalIncome: number; // 総所得
  socialInsurance: number; // 社会保険料
  incomeTax: number; // 所得税
  residentTax: number; // 住民税
  netIncome: number; // 手取り額
};
