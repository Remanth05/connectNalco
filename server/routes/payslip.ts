import { RequestHandler } from "express";
import { Payslip } from "@shared/api";
import { mockPayslips, mockUsers } from "../data/mockData";

// In-memory storage
let payslips = [...mockPayslips];

// Get payslips for an employee
export const getPayslips: RequestHandler = (req, res) => {
  const { employeeId } = req.params;
  const { year, month } = req.query;

  try {
    let employeePayslips = payslips.filter(
      (payslip) => payslip.employeeId === employeeId,
    );

    if (year) {
      employeePayslips = employeePayslips.filter(
        (payslip) => payslip.year === parseInt(year as string),
      );
    }

    if (month) {
      employeePayslips = employeePayslips.filter(
        (payslip) =>
          payslip.month.toLowerCase() === (month as string).toLowerCase(),
      );
    }

    // Sort by year and month (most recent first)
    employeePayslips.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      const months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];
      return (
        months.indexOf(b.month.toLowerCase()) -
        months.indexOf(a.month.toLowerCase())
      );
    });

    res.json({ success: true, data: employeePayslips });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch payslips" });
  }
};

// Get specific payslip
export const getPayslip: RequestHandler = (req, res) => {
  const { payslipId } = req.params;

  try {
    const payslip = payslips.find((p) => p.id === payslipId);

    if (!payslip) {
      return res
        .status(404)
        .json({ success: false, error: "Payslip not found" });
    }

    res.json({ success: true, data: payslip });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch payslip" });
  }
};

// Generate payslip for employee (admin function)
export const generatePayslip: RequestHandler = (req, res) => {
  const { employeeId } = req.params;
  const { month, year, salaryData } = req.body;

  try {
    const employee = mockUsers.find((user) => user.employeeId === employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    // Check if payslip already exists for this month/year
    const existingPayslip = payslips.find(
      (p) =>
        p.employeeId === employeeId &&
        p.month.toLowerCase() === month.toLowerCase() &&
        p.year === year,
    );

    if (existingPayslip) {
      return res.status(400).json({
        success: false,
        error: "Payslip already exists for this period",
      });
    }

    const grossSalary =
      salaryData.basicSalary +
      salaryData.hra +
      salaryData.allowances +
      salaryData.overtime +
      salaryData.bonus;

    const totalDeductions =
      salaryData.pf +
      salaryData.esi +
      salaryData.tax +
      salaryData.otherDeductions;

    const netSalary = grossSalary - totalDeductions;

    const newPayslip: Payslip = {
      id: `PAY${employeeId}_${year}_${month.substring(0, 2).toUpperCase()}`,
      employeeId,
      employeeName: employee.name,
      month,
      year,
      basicSalary: salaryData.basicSalary,
      hra: salaryData.hra,
      allowances: salaryData.allowances,
      overtime: salaryData.overtime,
      bonus: salaryData.bonus,
      grossSalary,
      pf: salaryData.pf,
      esi: salaryData.esi,
      tax: salaryData.tax,
      otherDeductions: salaryData.otherDeductions,
      totalDeductions,
      netSalary,
      generatedDate: new Date().toISOString().split("T")[0],
      status: "generated",
    };

    payslips.push(newPayslip);

    res.status(201).json({
      success: true,
      data: newPayslip,
      message: "Payslip generated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to generate payslip" });
  }
};

// Download payslip (returns formatted data for PDF generation)
export const downloadPayslip: RequestHandler = (req, res) => {
  const { payslipId } = req.params;

  try {
    const payslip = payslips.find((p) => p.id === payslipId);

    if (!payslip) {
      return res
        .status(404)
        .json({ success: false, error: "Payslip not found" });
    }

    // In a real application, this would generate and return a PDF
    // For now, we'll return the payslip data with additional formatting info
    const formattedPayslip = {
      ...payslip,
      companyName: "National Aluminium Company Limited (NALCO)",
      companyAddress:
        "Nalco Bhawan, Plot No. P/1, Nayapalli, Bhubaneswar - 751012",
      payslipNumber: payslip.id,
      currency: "INR",
      generatedBy: "Payroll System",
    };

    res.json({ success: true, data: formattedPayslip });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to download payslip" });
  }
};

// Get payslip summary for employee
export const getPayslipSummary: RequestHandler = (req, res) => {
  const { employeeId } = req.params;
  const { year } = req.query;

  try {
    let employeePayslips = payslips.filter(
      (payslip) => payslip.employeeId === employeeId,
    );

    if (year) {
      employeePayslips = employeePayslips.filter(
        (payslip) => payslip.year === parseInt(year as string),
      );
    }

    const summary = {
      totalPayslips: employeePayslips.length,
      totalGrossSalary: employeePayslips.reduce(
        (sum, p) => sum + p.grossSalary,
        0,
      ),
      totalNetSalary: employeePayslips.reduce((sum, p) => sum + p.netSalary, 0),
      totalDeductions: employeePayslips.reduce(
        (sum, p) => sum + p.totalDeductions,
        0,
      ),
      averageNetSalary:
        employeePayslips.length > 0
          ? employeePayslips.reduce((sum, p) => sum + p.netSalary, 0) /
            employeePayslips.length
          : 0,
      latestPayslip:
        employeePayslips.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          const months = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december",
          ];
          return (
            months.indexOf(b.month.toLowerCase()) -
            months.indexOf(a.month.toLowerCase())
          );
        })[0] || null,
    };

    res.json({ success: true, data: summary });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch payslip summary" });
  }
};
