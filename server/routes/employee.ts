import { RequestHandler } from "express";
import { Employee } from "@shared/api";
import { mockEmployees, mockDepartments } from "../data/mockData";

// In-memory storage
let employees = [...mockEmployees];
const departments = [...mockDepartments];

// Get all employees (with optional filtering)
export const getEmployees: RequestHandler = (req, res) => {
  const { department, search, isActive } = req.query;

  try {
    let filteredEmployees = [...employees];

    // Filter by department
    if (department) {
      filteredEmployees = filteredEmployees.filter(
        (emp) =>
          emp.department.toLowerCase() === (department as string).toLowerCase(),
      );
    }

    // Filter by active status
    if (isActive !== undefined) {
      filteredEmployees = filteredEmployees.filter(
        (emp) => emp.isActive === (isActive === "true"),
      );
    }

    // Search by name, email, or employee ID
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredEmployees = filteredEmployees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm) ||
          emp.email.toLowerCase().includes(searchTerm) ||
          emp.employeeId.toLowerCase().includes(searchTerm) ||
          emp.designation.toLowerCase().includes(searchTerm),
      );
    }

    // Sort by name
    filteredEmployees.sort((a, b) => a.name.localeCompare(b.name));

    res.json({ success: true, data: filteredEmployees });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch employees" });
  }
};

// Get employee by ID
export const getEmployee: RequestHandler = (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = employees.find((emp) => emp.employeeId === employeeId);

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch employee" });
  }
};

// Get employees by department
export const getEmployeesByDepartment: RequestHandler = (req, res) => {
  const { department } = req.params;

  try {
    const departmentEmployees = employees.filter(
      (emp) =>
        emp.department.toLowerCase() === department.toLowerCase() &&
        emp.isActive,
    );

    departmentEmployees.sort((a, b) => a.name.localeCompare(b.name));

    res.json({ success: true, data: departmentEmployees });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch department employees" });
  }
};

// Get reporting structure
export const getReportingStructure: RequestHandler = (req, res) => {
  const { managerId } = req.params;

  try {
    const directReports = employees.filter(
      (emp) => emp.reportingManager === managerId && emp.isActive,
    );

    const structure = directReports.map((emp) => ({
      employee: emp,
      subordinates: employees.filter(
        (subEmp) =>
          subEmp.reportingManager === emp.employeeId && subEmp.isActive,
      ),
    }));

    res.json({ success: true, data: structure });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch reporting structure" });
  }
};

// Get all departments
export const getDepartments: RequestHandler = (req, res) => {
  try {
    const departmentList = departments.filter((dept) => dept.isActive);
    res.json({ success: true, data: departmentList });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch departments" });
  }
};

// Get department statistics
export const getDepartmentStats: RequestHandler = (req, res) => {
  const { department } = req.params;

  try {
    const departmentEmployees = employees.filter(
      (emp) =>
        emp.department.toLowerCase() === department.toLowerCase() &&
        emp.isActive,
    );

    const stats = {
      totalEmployees: departmentEmployees.length,
      byDesignation: departmentEmployees.reduce(
        (acc, emp) => {
          acc[emp.designation] = (acc[emp.designation] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      avgTenure:
        departmentEmployees.reduce((sum, emp) => {
          const joinDate = new Date(emp.joinDate);
          const now = new Date();
          const tenure =
            (now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
          return sum + tenure;
        }, 0) / departmentEmployees.length,
      skillDistribution: departmentEmployees.reduce(
        (acc, emp) => {
          emp.skills?.forEach((skill) => {
            acc[skill] = (acc[skill] || 0) + 1;
          });
          return acc;
        },
        {} as Record<string, number>,
      ),
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch department statistics" });
  }
};

// Search employees with advanced filters
export const searchEmployees: RequestHandler = (req, res) => {
  const { query, filters } = req.body;

  try {
    let results = [...employees];

    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm) ||
          emp.email.toLowerCase().includes(searchTerm) ||
          emp.employeeId.toLowerCase().includes(searchTerm) ||
          emp.designation.toLowerCase().includes(searchTerm) ||
          emp.department.toLowerCase().includes(searchTerm) ||
          emp.skills?.some((skill) => skill.toLowerCase().includes(searchTerm)),
      );
    }

    // Apply filters
    if (filters) {
      if (filters.department) {
        results = results.filter((emp) =>
          filters.department.includes(emp.department),
        );
      }
      if (filters.designation) {
        results = results.filter((emp) =>
          filters.designation.includes(emp.designation),
        );
      }
      if (filters.location) {
        results = results.filter((emp) =>
          filters.location.includes(emp.location),
        );
      }
      if (filters.skills) {
        results = results.filter((emp) =>
          emp.skills?.some((skill) => filters.skills.includes(skill)),
        );
      }
      if (filters.joinDateRange) {
        const { start, end } = filters.joinDateRange;
        results = results.filter((emp) => {
          const joinDate = new Date(emp.joinDate);
          return joinDate >= new Date(start) && joinDate <= new Date(end);
        });
      }
    }

    // Sort results by relevance (name match first, then others)
    if (query) {
      results.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
        const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;

        return a.name.localeCompare(b.name);
      });
    } else {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to search employees" });
  }
};
