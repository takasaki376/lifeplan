import { CalculationResult } from '../types';

export const calculateNetIncome = (
  salaryIncome: number | undefined = 0,
  businessIncome: number | undefined = 0
): CalculationResult => {
  // 総所得 = 年収 + 雑所得
  const totalIncome = salaryIncome + businessIncome;

  // 社会保険料率（年収に応じた目安: 約15%）
  const socialInsuranceRate = 0.15;
  const socialInsurance = Math.round(salaryIncome * socialInsuranceRate);

  // 所得税計算（税率: 超過累進課税）
  const calculateIncomeTax = (taxableIncome: number): number => {
    if (taxableIncome <= 1950000) {
      return taxableIncome * 0.05;
    }
    if (taxableIncome <= 3300000) {
      return taxableIncome * 0.1 - 97500;
    }
    if (taxableIncome <= 6950000) {
      return taxableIncome * 0.2 - 427500;
    }
    if (taxableIncome <= 9000000) {
      return taxableIncome * 0.23 - 636000;
    }
    if (taxableIncome <= 18000000) {
      return taxableIncome * 0.33 - 1536000;
    }
    return taxableIncome * 0.4 - 2796000;
  };

  // 課税所得 = 総所得 - 社会保険料 - 基礎控除（48万円）
  const basicDeduction = 480000;
  const taxableIncome = Math.max(totalIncome - socialInsurance - basicDeduction, 0);
  const incomeTax = Math.round(calculateIncomeTax(taxableIncome));

  // 住民税（課税所得の10%）
  const residentTaxRate = 0.1;
  const residentTax = Math.round(taxableIncome * residentTaxRate);

  // 手取り額 = 総所得 - 社会保険料 - 所得税 - 住民税
  const netIncome = totalIncome - socialInsurance - incomeTax - residentTax;

  return {
    totalIncome,

    socialInsurance,
    incomeTax,
    residentTax,
    netIncome,
  };
};
