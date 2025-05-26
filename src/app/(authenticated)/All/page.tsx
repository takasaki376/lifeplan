'use client';

import { useState } from 'react';
import {
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCreditCard,
  IconCurrencyYen,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconPigMoney,
  IconPlus,
  IconStar,
  IconTrash,
  IconTrendingUp,
  IconUsers,
  IconWallet,
  IconX,
} from '@tabler/icons-react';
import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  Container,
  Grid,
  Group,
  MantineProvider,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

interface FamilyMember {
  id: string;
  name: string;
  birthDate: string;
  relationship: string;
}

interface Income {
  id: string;
  familyMemberId: string;
  startAge: string;
  endAge: string;
  monthlyIncome: string;
}

interface Expense {
  id: string;
  category: string;
  amount: string;
}

interface Investment {
  id: string;
  type: string;
  amount: string;
  expectedReturn: string;
}

interface Asset {
  id: string;
  type: string;
  yearMonth: string;
  amount: string;
}

interface Loan {
  id: string;
  type: string;
  balance: string;
  monthlyPayment: string;
  interestRate: string;
  completionYearMonth: string;
  interestRateChanges: InterestRateChange[];
  prepayments: Prepayment[];
}

interface InterestRateChange {
  id: string;
  year: string;
  newRate: string;
}

interface Prepayment {
  id: string;
  year: string;
  amount: string;
  type: 'principal' | 'period';
}

interface LifeEvent {
  id: string;
  event: string;
  yearMonth: string;
  estimatedCost: string;
}

interface LifePlanResult {
  year: number;
  age: number;
  totalAssets: number;
  totalIncome: number;
  totalExpenses: number;
  totalLoanBalance: number;
}

export default function LifePlanApp() {
  const [showInputForm, setShowInputForm] = useState(true);
  const [lifePlanResults, setLifePlanResults] = useState<LifePlanResult[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: '田中太郎', birthDate: '1988-05-15', relationship: '本人' },
  ]);
  const [incomes, setIncomes] = useState<Income[]>([
    { id: '1', familyMemberId: '1', startAge: '22', endAge: '65', monthlyIncome: '42' },
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: '住居費', amount: '12' },
  ]);
  const [investments, setInvestments] = useState<Investment[]>([
    { id: '1', type: 'NISA', amount: '100', expectedReturn: '5.0' },
  ]);
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', type: 'NISA', yearMonth: '2024-01', amount: '50' },
  ]);
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      type: '住宅ローン',
      balance: '2500',
      monthlyPayment: '8',
      interestRate: '1.5',
      completionYearMonth: '2054-03',
      interestRateChanges: [],
      prepayments: [],
    },
  ]);
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([
    { id: '1', event: '子供の大学進学', yearMonth: '2030-04', estimatedCost: '400' },
  ]);

  // 編集状態の管理
  const [editingFamily, setEditingFamily] = useState<string | null>(null);
  const [editingIncome, setEditingIncome] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [editingInvestment, setEditingInvestment] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [editingLoan, setEditingLoan] = useState<string | null>(null);
  const [editingLifeEvent, setEditingLifeEvent] = useState<string | null>(null);

  // 編集用の一時データ
  const [tempFamilyData, setTempFamilyData] = useState<FamilyMember | null>(null);
  const [tempIncomeData, setTempIncomeData] = useState<Income | null>(null);
  const [tempExpenseData, setTempExpenseData] = useState<Expense | null>(null);
  const [tempInvestmentData, setTempInvestmentData] = useState<Investment | null>(null);
  const [tempAssetData, setTempAssetData] = useState<Asset | null>(null);
  const [tempLoanData, setTempLoanData] = useState<Loan | null>(null);
  const [tempLifeEventData, setTempLifeEventData] = useState<LifeEvent | null>(null);

  // 金利変更の編集状態
  const [editingRateChange, setEditingRateChange] = useState<string | null>(null);
  const [tempRateChangeData, setTempRateChangeData] = useState<InterestRateChange | null>(null);

  // 繰り上げ返済の編集状態
  const [editingPrepayment, setEditingPrepayment] = useState<string | null>(null);
  const [tempPrepaymentData, setTempPrepaymentData] = useState<Prepayment | null>(null);

  // Accordionの開閉状態を管理
  const [accordionValues, setAccordionValues] = useState<string[]>([
    'family',
    'incomes',
    'expenses',
    'investments',
    'assets',
    'loans',
    'rate-changes',
    'prepayments',
    'events',
  ]);

  // 年齢計算関数
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // 家族名取得関数
  const getFamilyMemberName = (id: string): string => {
    const member = familyMembers.find((m) => m.id === id);
    return member ? member.name : '不明';
  };

  // ライフプラン計算関数
  const calculateLifePlan = () => {
    const mainPerson = familyMembers.find((member) => member.relationship === '本人');
    if (!mainPerson || !mainPerson.birthDate) {
      alert('本人の生年月日を入力してください');
      return;
    }

    const currentAge = calculateAge(mainPerson.birthDate);
    const maxAge = 100;
    const results: LifePlanResult[] = [];

    // 初期資産の計算
    let currentAssets = assets.reduce(
      (sum, asset) => sum + Number.parseFloat(asset.amount || '0'),
      0
    );

    // 各年の計算
    for (let age = currentAge; age <= maxAge; age++) {
      const currentYear = new Date().getFullYear() + (age - currentAge);

      // その年の収入計算
      let yearlyIncome = 0;
      familyMembers.forEach((member) => {
        const memberAge = calculateAge(member.birthDate) + (age - currentAge);
        incomes.forEach((income) => {
          if (
            income.familyMemberId === member.id &&
            memberAge >= Number.parseInt(income.startAge) &&
            memberAge <= Number.parseInt(income.endAge)
          ) {
            yearlyIncome += Number.parseFloat(income.monthlyIncome || '0') * 12;
          }
        });
      });

      // その年の支出計算
      let yearlyExpenses = expenses.reduce(
        (sum, expense) => sum + Number.parseFloat(expense.amount || '0') * 12,
        0
      );

      // ライフイベント費用の計算
      lifeEvents.forEach((event) => {
        const eventYear = Number.parseInt(event.yearMonth.split('-')[0]);
        if (eventYear === currentYear) {
          yearlyExpenses += Number.parseFloat(event.estimatedCost || '0');
        }
      });

      // ローン残高の計算
      let totalLoanBalance = 0;
      loans.forEach((loan) => {
        const completionYear = Number.parseInt(loan.completionYearMonth.split('-')[0]);
        if (currentYear <= completionYear) {
          // 簡略化：毎年の返済額を考慮した残高計算
          const yearsFromStart = currentYear - new Date().getFullYear();
          const annualPayment = Number.parseFloat(loan.monthlyPayment || '0') * 12;
          const remainingBalance = Math.max(
            0,
            Number.parseFloat(loan.balance || '0') - annualPayment * yearsFromStart
          );
          totalLoanBalance += remainingBalance;
        }
      });

      // 投資運用益の計算
      let investmentGains = 0;
      investments.forEach((investment) => {
        const annualReturn =
          (Number.parseFloat(investment.expectedReturn || '0') / 100) *
          Number.parseFloat(investment.amount || '0');
        investmentGains += annualReturn;
      });

      // 年間収支の計算
      const annualCashFlow = yearlyIncome - yearlyExpenses;

      // 総資産の更新
      currentAssets = currentAssets + annualCashFlow + investmentGains;

      results.push({
        year: currentYear,
        age,
        totalAssets: Math.round(currentAssets),
        totalIncome: Math.round(yearlyIncome),
        totalExpenses: Math.round(yearlyExpenses),
        totalLoanBalance: Math.round(totalLoanBalance),
      });
    }

    setLifePlanResults(results);
    setIsCalculated(true);
  };

  // 数値のフォーマット関数
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Accordion一括操作
  const openAllAccordions = () => {
    setAccordionValues([
      'family',
      'incomes',
      'expenses',
      'investments',
      'assets',
      'loans',
      'rate-changes',
      'prepayments',
      'events',
    ]);
  };

  const closeAllAccordions = () => {
    setAccordionValues([]);
  };

  // 家族構成の操作
  const addFamilyMember = () => {
    const newId = Date.now().toString();
    const newMember = { id: newId, name: '', birthDate: '', relationship: '' };
    setFamilyMembers([...familyMembers, newMember]);
    setEditingFamily(newId);
    setTempFamilyData(newMember);
  };

  const startEditFamily = (member: FamilyMember) => {
    setEditingFamily(member.id);
    setTempFamilyData({ ...member });
  };

  const saveFamily = () => {
    if (tempFamilyData) {
      setFamilyMembers(
        familyMembers.map((member) => (member.id === tempFamilyData.id ? tempFamilyData : member))
      );
    }
    setEditingFamily(null);
    setTempFamilyData(null);
  };

  const cancelEditFamily = () => {
    setEditingFamily(null);
    setTempFamilyData(null);
  };

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id));
    setIncomes(incomes.filter((income) => income.familyMemberId !== id));
  };

  // 収入の操作
  const addIncome = () => {
    const newId = Date.now().toString();
    const newIncome = {
      id: newId,
      familyMemberId: '',
      startAge: '',
      endAge: '',
      monthlyIncome: '',
    };
    setIncomes([...incomes, newIncome]);
    setEditingIncome(newId);
    setTempIncomeData(newIncome);
  };

  const startEditIncome = (income: Income) => {
    setEditingIncome(income.id);
    setTempIncomeData({ ...income });
  };

  const saveIncome = () => {
    if (tempIncomeData) {
      setIncomes(
        incomes.map((income) => (income.id === tempIncomeData.id ? tempIncomeData : income))
      );
    }
    setEditingIncome(null);
    setTempIncomeData(null);
  };

  const cancelEditIncome = () => {
    setEditingIncome(null);
    setTempIncomeData(null);
  };

  const deleteIncome = (id: string) => {
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  // 支出の操作
  const addExpense = () => {
    const newId = Date.now().toString();
    const newExpense = { id: newId, category: '', amount: '' };
    setExpenses([...expenses, newExpense]);
    setEditingExpense(newId);
    setTempExpenseData(newExpense);
  };

  const startEditExpense = (expense: Expense) => {
    setEditingExpense(expense.id);
    setTempExpenseData({ ...expense });
  };

  const saveExpense = () => {
    if (tempExpenseData) {
      setExpenses(
        expenses.map((expense) => (expense.id === tempExpenseData.id ? tempExpenseData : expense))
      );
    }
    setEditingExpense(null);
    setTempExpenseData(null);
  };

  const cancelEditExpense = () => {
    setEditingExpense(null);
    setTempExpenseData(null);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  // 投資の操作
  const addInvestment = () => {
    const newId = Date.now().toString();
    const newInvestment = { id: newId, type: '', amount: '', expectedReturn: '' };
    setInvestments([...investments, newInvestment]);
    setEditingInvestment(newId);
    setTempInvestmentData(newInvestment);
  };

  const startEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment.id);
    setTempInvestmentData({ ...investment });
  };

  const saveInvestment = () => {
    if (tempInvestmentData) {
      setInvestments(
        investments.map((investment) =>
          investment.id === tempInvestmentData.id ? tempInvestmentData : investment
        )
      );
    }
    setEditingInvestment(null);
    setTempInvestmentData(null);
  };

  const cancelEditInvestment = () => {
    setEditingInvestment(null);
    setTempInvestmentData(null);
  };

  const deleteInvestment = (id: string) => {
    setInvestments(investments.filter((investment) => investment.id !== id));
  };

  // 資産の操作
  const addAsset = () => {
    const newId = Date.now().toString();
    const newAsset = { id: newId, type: '', yearMonth: '', amount: '' };
    setAssets([...assets, newAsset]);
    setEditingAsset(newId);
    setTempAssetData(newAsset);
  };

  const startEditAsset = (asset: Asset) => {
    setEditingAsset(asset.id);
    setTempAssetData({ ...asset });
  };

  const saveAsset = () => {
    if (tempAssetData) {
      setAssets(assets.map((asset) => (asset.id === tempAssetData.id ? tempAssetData : asset)));
    }
    setEditingAsset(null);
    setTempAssetData(null);
  };

  const cancelEditAsset = () => {
    setEditingAsset(null);
    setTempAssetData(null);
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((asset) => asset.id !== id));
  };

  // 借入の操作
  const addLoan = () => {
    const newId = Date.now().toString();
    const newLoan = {
      id: newId,
      type: '',
      balance: '',
      monthlyPayment: '',
      interestRate: '',
      completionYearMonth: '',
      interestRateChanges: [],
      prepayments: [],
    };
    setLoans([...loans, newLoan]);
    setEditingLoan(newId);
    setTempLoanData(newLoan);
  };

  const startEditLoan = (loan: Loan) => {
    setEditingLoan(loan.id);
    setTempLoanData({ ...loan });
  };

  const saveLoan = () => {
    if (tempLoanData) {
      setLoans(loans.map((loan) => (loan.id === tempLoanData.id ? tempLoanData : loan)));
    }
    setEditingLoan(null);
    setTempLoanData(null);
  };

  const cancelEditLoan = () => {
    setEditingLoan(null);
    setTempLoanData(null);
  };

  const deleteLoan = (id: string) => {
    setLoans(loans.filter((loan) => loan.id !== id));
  };

  // ライフイベントの操作
  const addLifeEvent = () => {
    const newId = Date.now().toString();
    const newEvent = { id: newId, event: '', yearMonth: '', estimatedCost: '' };
    setLifeEvents([...lifeEvents, newEvent]);
    setEditingLifeEvent(newId);
    setTempLifeEventData(newEvent);
  };

  const startEditLifeEvent = (event: LifeEvent) => {
    setEditingLifeEvent(event.id);
    setTempLifeEventData({ ...event });
  };

  const saveLifeEvent = () => {
    if (tempLifeEventData) {
      setLifeEvents(
        lifeEvents.map((event) => (event.id === tempLifeEventData.id ? tempLifeEventData : event))
      );
    }
    setEditingLifeEvent(null);
    setTempLifeEventData(null);
  };

  const cancelEditLifeEvent = () => {
    setEditingLifeEvent(null);
    setTempLifeEventData(null);
  };

  const deleteLifeEvent = (id: string) => {
    setLifeEvents(lifeEvents.filter((event) => event.id !== id));
  };

  // 金利変更の操作関数
  const addRateChange = (loanId: string) => {
    const newId = Date.now().toString();
    const newRateChange = { id: newId, year: '', newRate: '' };
    setLoans(
      loans.map((loan) =>
        loan.id === loanId
          ? { ...loan, interestRateChanges: [...loan.interestRateChanges, newRateChange] }
          : loan
      )
    );
    setEditingRateChange(`${loanId}-${newId}`);
    setTempRateChangeData(newRateChange);
  };

  const startEditRateChange = (loanId: string, rateChange: InterestRateChange) => {
    setEditingRateChange(`${loanId}-${rateChange.id}`);
    setTempRateChangeData({ ...rateChange });
  };

  const saveRateChange = (loanId: string) => {
    if (tempRateChangeData) {
      setLoans(
        loans.map((loan) =>
          loan.id === loanId
            ? {
                ...loan,
                interestRateChanges: loan.interestRateChanges.map((change) =>
                  change.id === tempRateChangeData.id ? tempRateChangeData : change
                ),
              }
            : loan
        )
      );
    }
    setEditingRateChange(null);
    setTempRateChangeData(null);
  };

  const cancelEditRateChange = () => {
    setEditingRateChange(null);
    setTempRateChangeData(null);
  };

  const deleteRateChange = (loanId: string, rateChangeId: string) => {
    setLoans(
      loans.map((loan) =>
        loan.id === loanId
          ? {
              ...loan,
              interestRateChanges: loan.interestRateChanges.filter(
                (change) => change.id !== rateChangeId
              ),
            }
          : loan
      )
    );
  };

  // 繰り上げ返済の操作関数
  const addPrepayment = (loanId: string) => {
    const newId = Date.now().toString();
    const newPrepayment = { id: newId, year: '', amount: '', type: 'principal' as const };
    setLoans(
      loans.map((loan) =>
        loan.id === loanId ? { ...loan, prepayments: [...loan.prepayments, newPrepayment] } : loan
      )
    );
    setEditingPrepayment(`${loanId}-${newId}`);
    setTempPrepaymentData(newPrepayment);
  };

  const startEditPrepayment = (loanId: string, prepayment: Prepayment) => {
    setEditingPrepayment(`${loanId}-${prepayment.id}`);
    setTempPrepaymentData({ ...prepayment });
  };

  const savePrepayment = (loanId: string) => {
    if (tempPrepaymentData) {
      setLoans(
        loans.map((loan) =>
          loan.id === loanId
            ? {
                ...loan,
                prepayments: loan.prepayments.map((prepayment) =>
                  prepayment.id === tempPrepaymentData.id ? tempPrepaymentData : prepayment
                ),
              }
            : loan
        )
      );
    }
    setEditingPrepayment(null);
    setTempPrepaymentData(null);
  };

  const cancelEditPrepayment = () => {
    setEditingPrepayment(null);
    setTempPrepaymentData(null);
  };

  const deletePrepayment = (loanId: string, prepaymentId: string) => {
    setLoans(
      loans.map((loan) =>
        loan.id === loanId
          ? {
              ...loan,
              prepayments: loan.prepayments.filter((prepayment) => prepayment.id !== prepaymentId),
            }
          : loan
      )
    );
  };

  return (
    <MantineProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Container size="xl" py="xl">
          <Stack gap="xl">
            <div>
              <Group justify="space-between" align="flex-end">
                <div>
                  <Title order={1} mb="xs">
                    ライフプラン検討アプリ
                  </Title>
                  <Text c="dimmed">将来の資金計画を立てるために、現在の状況を入力してください</Text>
                </div>
                <Group gap="md">
                  <Switch
                    checked={showInputForm}
                    onChange={(event) => setShowInputForm(event.currentTarget.checked)}
                    label="入力フォーム表示"
                    thumbIcon={
                      showInputForm ? (
                        <IconEye size={12} stroke={2.5} />
                      ) : (
                        <IconEyeOff size={12} stroke={2.5} />
                      )
                    }
                  />
                </Group>
              </Group>
            </div>

            <Grid>
              {/* 左側：入力フォーム */}
              {showInputForm && (
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <Paper shadow="sm" p="lg" radius="md">
                    <Group mb="md" justify="flex-end">
                      <Button
                        variant="subtle"
                        size="xs"
                        leftSection={<IconChevronDown size={14} />}
                        onClick={openAllAccordions}
                      >
                        全て開く
                      </Button>
                      <Button
                        variant="subtle"
                        size="xs"
                        leftSection={<IconChevronUp size={14} />}
                        onClick={closeAllAccordions}
                      >
                        全て閉じる
                      </Button>
                    </Group>
                    <Accordion multiple value={accordionValues} onChange={setAccordionValues}>
                      {/* 家族構成 */}
                      <Accordion.Item value="family">
                        <Accordion.Control icon={<IconUsers size={20} />}>
                          <Title order={4}>家族構成</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="md">
                            <Table>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>名前</Table.Th>
                                  <Table.Th>生年月日</Table.Th>
                                  <Table.Th>年齢</Table.Th>
                                  <Table.Th>続柄</Table.Th>
                                  <Table.Th>操作</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {familyMembers.map((member) => (
                                  <Table.Tr key={member.id}>
                                    {editingFamily === member.id ? (
                                      <>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            value={tempFamilyData?.name || ''}
                                            onChange={(e) =>
                                              setTempFamilyData((prev) =>
                                                prev ? { ...prev, name: e.target.value } : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="date"
                                            value={tempFamilyData?.birthDate || ''}
                                            onChange={(e) =>
                                              setTempFamilyData((prev) =>
                                                prev ? { ...prev, birthDate: e.target.value } : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          {tempFamilyData?.birthDate
                                            ? `${calculateAge(tempFamilyData.birthDate)}歳`
                                            : '-'}
                                        </Table.Td>
                                        <Table.Td>
                                          <Select
                                            size="xs"
                                            value={tempFamilyData?.relationship || ''}
                                            onChange={(value) =>
                                              setTempFamilyData((prev) =>
                                                prev ? { ...prev, relationship: value || '' } : null
                                              )
                                            }
                                            data={[
                                              { value: '本人', label: '本人' },
                                              { value: '配偶者', label: '配偶者' },
                                              { value: '子供', label: '子供' },
                                              { value: '親', label: '親' },
                                              { value: 'その他', label: 'その他' },
                                            ]}
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              color="green"
                                              onClick={saveFamily}
                                            >
                                              <IconCheck size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="gray"
                                              onClick={cancelEditFamily}
                                            >
                                              <IconX size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    ) : (
                                      <>
                                        <Table.Td>{member.name}</Table.Td>
                                        <Table.Td>{member.birthDate}</Table.Td>
                                        <Table.Td>
                                          {member.birthDate
                                            ? `${calculateAge(member.birthDate)}歳`
                                            : '-'}
                                        </Table.Td>
                                        <Table.Td>
                                          <Badge size="sm" variant="light">
                                            {member.relationship}
                                          </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              variant="light"
                                              onClick={() => startEditFamily(member)}
                                            >
                                              <IconEdit size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="red"
                                              variant="light"
                                              onClick={() => deleteFamilyMember(member.id)}
                                            >
                                              <IconTrash size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    )}
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            </Table>
                            <Button
                              leftSection={<IconPlus size={16} />}
                              variant="outline"
                              size="sm"
                              onClick={addFamilyMember}
                            >
                              家族メンバーを追加
                            </Button>
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>

                      {/* 月の収入 */}
                      <Accordion.Item value="incomes">
                        <Accordion.Control icon={<IconWallet size={20} />}>
                          <Title order={4}>月の収入</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="md">
                            <Table>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>家族</Table.Th>
                                  <Table.Th>開始年齢</Table.Th>
                                  <Table.Th>終了年齢</Table.Th>
                                  <Table.Th>月収(万円)</Table.Th>
                                  <Table.Th>操作</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {incomes.map((income) => (
                                  <Table.Tr key={income.id}>
                                    {editingIncome === income.id ? (
                                      <>
                                        <Table.Td>
                                          <Select
                                            size="xs"
                                            value={tempIncomeData?.familyMemberId || ''}
                                            onChange={(value) =>
                                              setTempIncomeData((prev) =>
                                                prev
                                                  ? { ...prev, familyMemberId: value || '' }
                                                  : null
                                              )
                                            }
                                            data={familyMembers.map((member) => ({
                                              value: member.id,
                                              label: member.name,
                                            }))}
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="number"
                                            value={tempIncomeData?.startAge || ''}
                                            onChange={(e) =>
                                              setTempIncomeData((prev) =>
                                                prev ? { ...prev, startAge: e.target.value } : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="number"
                                            value={tempIncomeData?.endAge || ''}
                                            onChange={(e) =>
                                              setTempIncomeData((prev) =>
                                                prev ? { ...prev, endAge: e.target.value } : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="number"
                                            value={tempIncomeData?.monthlyIncome || ''}
                                            onChange={(e) =>
                                              setTempIncomeData((prev) =>
                                                prev
                                                  ? { ...prev, monthlyIncome: e.target.value }
                                                  : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              color="green"
                                              onClick={saveIncome}
                                            >
                                              <IconCheck size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="gray"
                                              onClick={cancelEditIncome}
                                            >
                                              <IconX size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    ) : (
                                      <>
                                        <Table.Td>
                                          <Badge size="sm" variant="light">
                                            {getFamilyMemberName(income.familyMemberId)}
                                          </Badge>
                                        </Table.Td>
                                        <Table.Td>{income.startAge}歳</Table.Td>
                                        <Table.Td>{income.endAge}歳</Table.Td>
                                        <Table.Td>{income.monthlyIncome}万円</Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              variant="light"
                                              onClick={() => startEditIncome(income)}
                                            >
                                              <IconEdit size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="red"
                                              variant="light"
                                              onClick={() => deleteIncome(income.id)}
                                            >
                                              <IconTrash size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    )}
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            </Table>
                            <Button
                              leftSection={<IconPlus size={16} />}
                              variant="outline"
                              size="sm"
                              onClick={addIncome}
                            >
                              収入を追加
                            </Button>
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>

                      {/* 月の支出 */}
                      <Accordion.Item value="expenses">
                        <Accordion.Control icon={<IconCurrencyYen size={20} />}>
                          <Title order={4}>月の支出</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="md">
                            <Table>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>支出項目</Table.Th>
                                  <Table.Th>金額(万円)</Table.Th>
                                  <Table.Th>操作</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {expenses.map((expense) => (
                                  <Table.Tr key={expense.id}>
                                    {editingExpense === expense.id ? (
                                      <>
                                        <Table.Td>
                                          <Select
                                            size="xs"
                                            value={tempExpenseData?.category || ''}
                                            onChange={(value) =>
                                              setTempExpenseData((prev) =>
                                                prev ? { ...prev, category: value || '' } : null
                                              )
                                            }
                                            data={[
                                              { value: '住居費', label: '住居費' },
                                              { value: '食費', label: '食費' },
                                              { value: '光熱費', label: '光熱費' },
                                              { value: '通信費', label: '通信費' },
                                              { value: '交通費', label: '交通費' },
                                              { value: '保険料', label: '保険料' },
                                              { value: '教育費', label: '教育費' },
                                              { value: '娯楽費', label: '娯楽費' },
                                              { value: 'その他', label: 'その他' },
                                            ]}
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="number"
                                            value={tempExpenseData?.amount || ''}
                                            onChange={(e) =>
                                              setTempExpenseData((prev) =>
                                                prev ? { ...prev, amount: e.target.value } : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              color="green"
                                              onClick={saveExpense}
                                            >
                                              <IconCheck size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="gray"
                                              onClick={cancelEditExpense}
                                            >
                                              <IconX size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    ) : (
                                      <>
                                        <Table.Td>
                                          <Badge size="sm" variant="light">
                                            {expense.category}
                                          </Badge>
                                        </Table.Td>
                                        <Table.Td>{expense.amount}万円</Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              variant="light"
                                              onClick={() => startEditExpense(expense)}
                                            >
                                              <IconEdit size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="red"
                                              variant="light"
                                              onClick={() => deleteExpense(expense.id)}
                                            >
                                              <IconTrash size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    )}
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            </Table>
                            <Button
                              leftSection={<IconPlus size={16} />}
                              variant="outline"
                              size="sm"
                              onClick={addExpense}
                            >
                              支出項目を追加
                            </Button>
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>

                      {/* 投資 */}
                      <Accordion.Item value="investments">
                        <Accordion.Control icon={<IconTrendingUp size={20} />}>
                          <Title order={4}>投資</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="md">
                            <Table>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>投資種類</Table.Th>
                                  <Table.Th>投資額(万円)</Table.Th>
                                  <Table.Th>期待利回り(%)</Table.Th>
                                  <Table.Th>操作</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {investments.map((investment) => (
                                  <Table.Tr key={investment.id}>
                                    {editingInvestment === investment.id ? (
                                      <>
                                        <Table.Td>
                                          <Select
                                            size="xs"
                                            value={tempInvestmentData?.type || ''}
                                            onChange={(value) =>
                                              setTempInvestmentData((prev) =>
                                                prev ? { ...prev, type: value || '' } : null
                                              )
                                            }
                                            data={[
                                              { value: '株式', label: '株式' },
                                              { value: '投資信託', label: '投資信託' },
                                              { value: '債券', label: '債券' },
                                              { value: 'NISA', label: 'NISA' },
                                              { value: 'iDeCo', label: 'iDeCo' },
                                              { value: '不動産', label: '不動産' },
                                              { value: 'その他', label: 'その他' },
                                            ]}
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="number"
                                            value={tempInvestmentData?.amount || ''}
                                            onChange={(e) =>
                                              setTempInvestmentData((prev) =>
                                                prev ? { ...prev, amount: e.target.value } : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="number"
                                            step="0.1"
                                            value={tempInvestmentData?.expectedReturn || ''}
                                            onChange={(e) =>
                                              setTempInvestmentData((prev) =>
                                                prev
                                                  ? { ...prev, expectedReturn: e.target.value }
                                                  : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              color="green"
                                              onClick={saveInvestment}
                                            >
                                              <IconCheck size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="gray"
                                              onClick={cancelEditInvestment}
                                            >
                                              <IconX size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    ) : (
                                      <>
                                        <Table.Td>
                                          <Badge size="sm" variant="light">
                                            {investment.type}
                                          </Badge>
                                        </Table.Td>
                                        <Table.Td>{investment.amount}万円</Table.Td>
                                        <Table.Td>{investment.expectedReturn}%</Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              variant="light"
                                              onClick={() => startEditInvestment(investment)}
                                            >
                                              <IconEdit size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="red"
                                              variant="light"
                                              onClick={() => deleteInvestment(investment.id)}
                                            >
                                              <IconTrash size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    )}
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            </Table>
                            <Button
                              leftSection={<IconPlus size={16} />}
                              variant="outline"
                              size="sm"
                              onClick={addInvestment}
                            >
                              投資を追加
                            </Button>
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>

                      {/* 資産 */}
                      <Accordion.Item value="assets">
                        <Accordion.Control icon={<IconPigMoney size={20} />}>
                          <Title order={4}>資産</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="md">
                            <Table>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>資産種類</Table.Th>
                                  <Table.Th>時点</Table.Th>
                                  <Table.Th>資産額(万円)</Table.Th>
                                  <Table.Th>操作</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {assets.map((asset) => (
                                  <Table.Tr key={asset.id}>
                                    {editingAsset === asset.id ? (
                                      <>
                                        <Table.Td>
                                          <Select
                                            size="xs"
                                            value={tempAssetData?.type || ''}
                                            onChange={(value) =>
                                              setTempAssetData((prev) =>
                                                prev ? { ...prev, type: value || '' } : null
                                              )
                                            }
                                            data={[
                                              { value: '現金・預金', label: '現金・預金' },
                                              { value: '株式', label: '株式' },
                                              { value: '投資信託', label: '投資信託' },
                                              { value: '債券', label: '債券' },
                                              { value: 'NISA', label: 'NISA' },
                                              { value: 'iDeCo', label: 'iDeCo' },
                                              { value: '不動産', label: '不動産' },
                                              { value: '保険', label: '保険' },
                                              { value: 'その他', label: 'その他' },
                                            ]}
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="month"
                                            value={tempAssetData?.yearMonth || ''}
                                            onChange={(e) =>
                                              setTempAssetData((prev) =>
                                                prev ? { ...prev, yearMonth: e.target.value } : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="number"
                                            value={tempAssetData?.amount || ''}
                                            onChange={(e) =>
                                              setTempAssetData((prev) =>
                                                prev ? { ...prev, amount: e.target.value } : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon size="sm" color="green" onClick={saveAsset}>
                                              <IconCheck size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="gray"
                                              onClick={cancelEditAsset}
                                            >
                                              <IconX size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    ) : (
                                      <>
                                        <Table.Td>
                                          <Badge size="sm" variant="light">
                                            {asset.type}
                                          </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                          <Badge size="sm" variant="outline">
                                            {asset.yearMonth}
                                          </Badge>
                                        </Table.Td>
                                        <Table.Td>{asset.amount}万円</Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              variant="light"
                                              onClick={() => startEditAsset(asset)}
                                            >
                                              <IconEdit size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="red"
                                              variant="light"
                                              onClick={() => deleteAsset(asset.id)}
                                            >
                                              <IconTrash size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    )}
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            </Table>
                            <Button
                              leftSection={<IconPlus size={16} />}
                              variant="outline"
                              size="sm"
                              onClick={addAsset}
                            >
                              資産を追加
                            </Button>
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>

                      {/* 借入金 */}
                      <Accordion.Item value="loans">
                        <Accordion.Control icon={<IconCreditCard size={20} />}>
                          <Title order={4}>借入金</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="md">
                            <Table>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>借入種類</Table.Th>
                                  <Table.Th>残高(万円)</Table.Th>
                                  <Table.Th>月返済額(万円)</Table.Th>
                                  <Table.Th>金利(%)</Table.Th>
                                  <Table.Th>返済完了年月</Table.Th>
                                  <Table.Th>操作</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {loans.map((loan) => (
                                  <Table.Tr key={loan.id}>
                                    {editingLoan === loan.id ? (
                                      <>
                                        <Table.Td>
                                          <Select
                                            size="xs"
                                            value={tempLoanData?.type || ''}
                                            onChange={(value) =>
                                              setTempLoanData((prev) =>
                                                prev ? { ...prev, type: value || '' } : null
                                              )
                                            }
                                            data={[
                                              { value: '住宅ローン', label: '住宅ローン' },
                                              { value: '自動車ローン', label: '自動車ローン' },
                                              { value: '教育ローン', label: '教育ローン' },
                                              { value: 'カードローン', label: 'カードローン' },
                                              { value: 'その他', label: 'その他' },
                                            ]}
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="number"
                                            value={tempLoanData?.balance || ''}
                                            onChange={(e) =>
                                              setTempLoanData((prev) =>
                                                prev ? { ...prev, balance: e.target.value } : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="number"
                                            value={tempLoanData?.monthlyPayment || ''}
                                            onChange={(e) =>
                                              setTempLoanData((prev) =>
                                                prev
                                                  ? { ...prev, monthlyPayment: e.target.value }
                                                  : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="number"
                                            step="0.01"
                                            value={tempLoanData?.interestRate || ''}
                                            onChange={(e) =>
                                              setTempLoanData((prev) =>
                                                prev
                                                  ? { ...prev, interestRate: e.target.value }
                                                  : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="month"
                                            value={tempLoanData?.completionYearMonth || ''}
                                            onChange={(e) =>
                                              setTempLoanData((prev) =>
                                                prev
                                                  ? { ...prev, completionYearMonth: e.target.value }
                                                  : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon size="sm" color="green" onClick={saveLoan}>
                                              <IconCheck size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="gray"
                                              onClick={cancelEditLoan}
                                            >
                                              <IconX size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    ) : (
                                      <>
                                        <Table.Td>
                                          <Badge size="sm" variant="light">
                                            {loan.type}
                                          </Badge>
                                        </Table.Td>
                                        <Table.Td>{loan.balance}万円</Table.Td>
                                        <Table.Td>{loan.monthlyPayment}万円</Table.Td>
                                        <Table.Td>{loan.interestRate}%</Table.Td>
                                        <Table.Td>
                                          <Badge size="sm" variant="outline">
                                            {loan.completionYearMonth}
                                          </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              variant="light"
                                              onClick={() => startEditLoan(loan)}
                                            >
                                              <IconEdit size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="red"
                                              variant="light"
                                              onClick={() => deleteLoan(loan.id)}
                                            >
                                              <IconTrash size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    )}
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            </Table>
                            <Button
                              leftSection={<IconPlus size={16} />}
                              variant="outline"
                              size="sm"
                              onClick={addLoan}
                            >
                              借入を追加
                            </Button>
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>

                      {/* 金利変更予定 */}
                      <Accordion.Item value="rate-changes">
                        <Accordion.Control icon={<IconTrendingUp size={20} />}>
                          <Title order={4}>金利変更予定</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="md">
                            <Table>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>借入種類</Table.Th>
                                  <Table.Th>変更年</Table.Th>
                                  <Table.Th>新金利(%)</Table.Th>
                                  <Table.Th>操作</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {loans.flatMap((loan) =>
                                  loan.interestRateChanges.map((change) => (
                                    <Table.Tr key={`${loan.id}-${change.id}`}>
                                      {editingRateChange === `${loan.id}-${change.id}` ? (
                                        <>
                                          <Table.Td>
                                            <Badge size="sm" variant="light">
                                              {loan.type}
                                            </Badge>
                                          </Table.Td>
                                          <Table.Td>
                                            <TextInput
                                              size="xs"
                                              type="number"
                                              value={tempRateChangeData?.year || ''}
                                              onChange={(e) =>
                                                setTempRateChangeData((prev) =>
                                                  prev ? { ...prev, year: e.target.value } : null
                                                )
                                              }
                                            />
                                          </Table.Td>
                                          <Table.Td>
                                            <TextInput
                                              size="xs"
                                              type="number"
                                              step="0.01"
                                              value={tempRateChangeData?.newRate || ''}
                                              onChange={(e) =>
                                                setTempRateChangeData((prev) =>
                                                  prev ? { ...prev, newRate: e.target.value } : null
                                                )
                                              }
                                            />
                                          </Table.Td>
                                          <Table.Td>
                                            <Group gap="xs">
                                              <ActionIcon
                                                size="sm"
                                                color="green"
                                                onClick={() => saveRateChange(loan.id)}
                                              >
                                                <IconCheck size={14} />
                                              </ActionIcon>
                                              <ActionIcon
                                                size="sm"
                                                color="gray"
                                                onClick={cancelEditRateChange}
                                              >
                                                <IconX size={14} />
                                              </ActionIcon>
                                            </Group>
                                          </Table.Td>
                                        </>
                                      ) : (
                                        <>
                                          <Table.Td>
                                            <Badge size="sm" variant="light">
                                              {loan.type}
                                            </Badge>
                                          </Table.Td>
                                          <Table.Td>
                                            <Badge size="sm" variant="outline">
                                              {change.year}年
                                            </Badge>
                                          </Table.Td>
                                          <Table.Td>{change.newRate}%</Table.Td>
                                          <Table.Td>
                                            <Group gap="xs">
                                              <ActionIcon
                                                size="sm"
                                                variant="light"
                                                onClick={() => startEditRateChange(loan.id, change)}
                                              >
                                                <IconEdit size={14} />
                                              </ActionIcon>
                                              <ActionIcon
                                                size="sm"
                                                color="red"
                                                variant="light"
                                                onClick={() => deleteRateChange(loan.id, change.id)}
                                              >
                                                <IconTrash size={14} />
                                              </ActionIcon>
                                            </Group>
                                          </Table.Td>
                                        </>
                                      )}
                                    </Table.Tr>
                                  ))
                                )}
                              </Table.Tbody>
                            </Table>
                            <Select
                              placeholder="借入を選択して金利変更を追加"
                              data={loans.map((loan) => ({ value: loan.id, label: loan.type }))}
                              onChange={(value) => value && addRateChange(value)}
                            />
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>

                      {/* 繰り上げ返済予定 */}
                      <Accordion.Item value="prepayments">
                        <Accordion.Control icon={<IconCurrencyYen size={20} />}>
                          <Title order={4}>繰り上げ返済予定</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="md">
                            <Table>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>借入種類</Table.Th>
                                  <Table.Th>実行年</Table.Th>
                                  <Table.Th>返済額(万円)</Table.Th>
                                  <Table.Th>返済方法</Table.Th>
                                  <Table.Th>操作</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {loans.flatMap((loan) =>
                                  loan.prepayments.map((prepayment) => (
                                    <Table.Tr key={`${loan.id}-${prepayment.id}`}>
                                      {editingPrepayment === `${loan.id}-${prepayment.id}` ? (
                                        <>
                                          <Table.Td>
                                            <Badge size="sm" variant="light">
                                              {loan.type}
                                            </Badge>
                                          </Table.Td>
                                          <Table.Td>
                                            <TextInput
                                              size="xs"
                                              type="number"
                                              value={tempPrepaymentData?.year || ''}
                                              onChange={(e) =>
                                                setTempPrepaymentData((prev) =>
                                                  prev ? { ...prev, year: e.target.value } : null
                                                )
                                              }
                                            />
                                          </Table.Td>
                                          <Table.Td>
                                            <TextInput
                                              size="xs"
                                              type="number"
                                              value={tempPrepaymentData?.amount || ''}
                                              onChange={(e) =>
                                                setTempPrepaymentData((prev) =>
                                                  prev ? { ...prev, amount: e.target.value } : null
                                                )
                                              }
                                            />
                                          </Table.Td>
                                          <Table.Td>
                                            <Select
                                              size="xs"
                                              value={tempPrepaymentData?.type || ''}
                                              onChange={(value) =>
                                                setTempPrepaymentData((prev) =>
                                                  prev
                                                    ? {
                                                        ...prev,
                                                        type: value as 'principal' | 'period',
                                                      }
                                                    : null
                                                )
                                              }
                                              data={[
                                                { value: 'principal', label: '元金軽減型' },
                                                { value: 'period', label: '期間短縮型' },
                                              ]}
                                            />
                                          </Table.Td>
                                          <Table.Td>
                                            <Group gap="xs">
                                              <ActionIcon
                                                size="sm"
                                                color="green"
                                                onClick={() => savePrepayment(loan.id)}
                                              >
                                                <IconCheck size={14} />
                                              </ActionIcon>
                                              <ActionIcon
                                                size="sm"
                                                color="gray"
                                                onClick={cancelEditPrepayment}
                                              >
                                                <IconX size={14} />
                                              </ActionIcon>
                                            </Group>
                                          </Table.Td>
                                        </>
                                      ) : (
                                        <>
                                          <Table.Td>
                                            <Badge size="sm" variant="light">
                                              {loan.type}
                                            </Badge>
                                          </Table.Td>
                                          <Table.Td>
                                            <Badge size="sm" variant="outline">
                                              {prepayment.year}年
                                            </Badge>
                                          </Table.Td>
                                          <Table.Td>{prepayment.amount}万円</Table.Td>
                                          <Table.Td>
                                            <Badge
                                              size="sm"
                                              color={
                                                prepayment.type === 'principal' ? 'blue' : 'green'
                                              }
                                            >
                                              {prepayment.type === 'principal'
                                                ? '元金軽減型'
                                                : '期間短縮型'}
                                            </Badge>
                                          </Table.Td>
                                          <Table.Td>
                                            <Group gap="xs">
                                              <ActionIcon
                                                size="sm"
                                                variant="light"
                                                onClick={() =>
                                                  startEditPrepayment(loan.id, prepayment)
                                                }
                                              >
                                                <IconEdit size={14} />
                                              </ActionIcon>
                                              <ActionIcon
                                                size="sm"
                                                color="red"
                                                variant="light"
                                                onClick={() =>
                                                  deletePrepayment(loan.id, prepayment.id)
                                                }
                                              >
                                                <IconTrash size={14} />
                                              </ActionIcon>
                                            </Group>
                                          </Table.Td>
                                        </>
                                      )}
                                    </Table.Tr>
                                  ))
                                )}
                              </Table.Tbody>
                            </Table>
                            <Select
                              placeholder="借入を選択して繰り上げ返済を追加"
                              data={loans.map((loan) => ({ value: loan.id, label: loan.type }))}
                              onChange={(value) => value && addPrepayment(value)}
                            />
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>

                      {/* ライフイベント */}
                      <Accordion.Item value="events">
                        <Accordion.Control icon={<IconStar size={20} />}>
                          <Title order={4}>ライフイベント</Title>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack gap="md">
                            <Table>
                              <Table.Thead>
                                <Table.Tr>
                                  <Table.Th>イベント</Table.Th>
                                  <Table.Th>予定年月</Table.Th>
                                  <Table.Th>予想費用(万円)</Table.Th>
                                  <Table.Th>操作</Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody>
                                {lifeEvents.map((event) => (
                                  <Table.Tr key={event.id}>
                                    {editingLifeEvent === event.id ? (
                                      <>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            value={tempLifeEventData?.event || ''}
                                            onChange={(e) =>
                                              setTempLifeEventData((prev) =>
                                                prev ? { ...prev, event: e.target.value } : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="month"
                                            value={tempLifeEventData?.yearMonth || ''}
                                            onChange={(e) =>
                                              setTempLifeEventData((prev) =>
                                                prev ? { ...prev, yearMonth: e.target.value } : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <TextInput
                                            size="xs"
                                            type="number"
                                            value={tempLifeEventData?.estimatedCost || ''}
                                            onChange={(e) =>
                                              setTempLifeEventData((prev) =>
                                                prev
                                                  ? { ...prev, estimatedCost: e.target.value }
                                                  : null
                                              )
                                            }
                                          />
                                        </Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              color="green"
                                              onClick={saveLifeEvent}
                                            >
                                              <IconCheck size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="gray"
                                              onClick={cancelEditLifeEvent}
                                            >
                                              <IconX size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    ) : (
                                      <>
                                        <Table.Td>{event.event}</Table.Td>
                                        <Table.Td>
                                          <Badge size="sm" variant="light">
                                            {event.yearMonth}
                                          </Badge>
                                        </Table.Td>
                                        <Table.Td>{event.estimatedCost}万円</Table.Td>
                                        <Table.Td>
                                          <Group gap="xs">
                                            <ActionIcon
                                              size="sm"
                                              variant="light"
                                              onClick={() => startEditLifeEvent(event)}
                                            >
                                              <IconEdit size={14} />
                                            </ActionIcon>
                                            <ActionIcon
                                              size="sm"
                                              color="red"
                                              variant="light"
                                              onClick={() => deleteLifeEvent(event.id)}
                                            >
                                              <IconTrash size={14} />
                                            </ActionIcon>
                                          </Group>
                                        </Table.Td>
                                      </>
                                    )}
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            </Table>
                            <Button
                              leftSection={<IconPlus size={16} />}
                              variant="outline"
                              size="sm"
                              onClick={addLifeEvent}
                            >
                              ライフイベントを追加
                            </Button>
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>

                    <Group mt="xl">
                      <Button
                        leftSection={<IconCalendar size={16} />}
                        style={{ flex: 1 }}
                        onClick={calculateLifePlan}
                      >
                        ライフプランを計算
                      </Button>
                      <Button variant="outline">データを保存</Button>
                    </Group>
                  </Paper>
                </Grid.Col>
              )}

              {/* 右側：結果表示エリア */}
              <Grid.Col span={{ base: 12, lg: showInputForm ? 6 : 12 }}>
                <Paper shadow="sm" p="lg" radius="md">
                  <Group mb="md">
                    <Title order={3}>ライフプラン結果</Title>
                  </Group>
                  {!isCalculated ? (
                    <>
                      <Text size="sm" c="dimmed" mb="lg">
                        入力された情報を基に、将来の資金計画を表示します
                      </Text>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: showInputForm ? '300px' : '600px',
                          color: '#868e96',
                        }}
                      >
                        <Stack align="center" gap="md">
                          <IconCalendar size={48} style={{ opacity: 0.5 }} />
                          <div style={{ textAlign: 'center' }}>
                            <Text>左側のフォームに情報を入力して</Text>
                            <Text>「ライフプランを計算」ボタンを押してください</Text>
                            {!showInputForm && (
                              <Text mt="md" size="sm" c="dimmed">
                                入力フォームを表示するには、上部のスイッチをオンにしてください
                              </Text>
                            )}
                          </div>
                        </Stack>
                      </div>
                    </>
                  ) : (
                    <>
                      <Text size="sm" c="dimmed" mb="lg">
                        年齢別のライフプラン推移（単位：万円）
                      </Text>
                      <ScrollArea h={showInputForm ? 400 : 600}>
                        <Table striped highlightOnHover>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>年</Table.Th>
                              <Table.Th>年齢</Table.Th>
                              <Table.Th style={{ textAlign: 'right' }}>総資産</Table.Th>
                              <Table.Th style={{ textAlign: 'right' }}>年収入</Table.Th>
                              <Table.Th style={{ textAlign: 'right' }}>年支出</Table.Th>
                              <Table.Th style={{ textAlign: 'right' }}>ローン残高</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {lifePlanResults.map((result) => (
                              <Table.Tr key={result.year}>
                                <Table.Td>{result.year}</Table.Td>
                                <Table.Td>{result.age}歳</Table.Td>
                                <Table.Td
                                  style={{
                                    textAlign: 'right',
                                    color: result.totalAssets < 0 ? 'red' : 'inherit',
                                  }}
                                >
                                  {formatNumber(result.totalAssets)}
                                </Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>
                                  {formatNumber(result.totalIncome)}
                                </Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>
                                  {formatNumber(result.totalExpenses)}
                                </Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>
                                  {formatNumber(result.totalLoanBalance)}
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </ScrollArea>
                    </>
                  )}
                </Paper>
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </div>
    </MantineProvider>
  );
}
