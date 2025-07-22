import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Directory() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load employee data from localStorage or use default NALCO employees
  useEffect(() => {
    const savedEmployees = localStorage.getItem("nalco_employees");
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    } else {
      // Default NALCO employees
      const defaultEmployees = [
        {
          id: 1,
          name: "Rajesh Kumar Singh",
          position: "HR Executive",
          department: "Human Resources",
          team: "Employee Relations",
          email: "rajesh.singh@nalco.com",
          phone: "+91-9876543210",
          location: "Damanjodi Plant",
          avatar: "RK",
          status: "Available",
          employeeId: "EMP001",
          joinDate: "2022-03-15"
        },
        {
          id: 2,
          name: "Dr. Priya Sharma",
          position: "Department Head",
          department: "Human Resources",
          team: "Management",
          email: "priya.sharma@nalco.com",
          phone: "+91-9876543211",
          location: "Damanjodi Plant",
          avatar: "PS",
          status: "In Meeting",
          employeeId: "AUTH001",
          joinDate: "2018-06-20"
        },
        {
          id: 3,
          name: "Sunita Devi",
          position: "HR Assistant",
          department: "Human Resources",
          team: "Administration",
          email: "sunita.devi@nalco.com",
          phone: "+91-9876543213",
          location: "Damanjodi Plant",
          avatar: "SD",
          status: "Available",
          employeeId: "EMP002",
          joinDate: "2021-07-20"
        },
        {
          id: 4,
          name: "Mohammad Alam",
          position: "Trainee",
          department: "Human Resources",
          team: "Training Program",
          email: "mohammad.alam@nalco.com",
          phone: "+91-9876543214",
          location: "Damanjodi Plant",
          avatar: "MA",
          status: "On Leave",
          employeeId: "EMP003",
          joinDate: "2023-11-05"
        },
        {
          id: 5,
          name: "Anita Das",
          position: "Engineering Manager",
          department: "Engineering",
          team: "Plant Operations",
          email: "anita.das@nalco.com",
          phone: "+91-9876543215",
          location: "Plant Area 1",
          avatar: "AD",
          status: "Available",
          employeeId: "ENG001",
          joinDate: "2019-01-10"
        },
        {
          id: 6,
          name: "Suresh Babu",
          position: "Finance Manager",
          department: "Finance",
          team: "Accounts",
          email: "suresh.babu@nalco.com",
          phone: "+91-9876543216",
          location: "Admin Block B",
          avatar: "SB",
          status: "Available",
          employeeId: "FIN001",
          joinDate: "2020-04-15"
        },
      ];
      setEmployees(defaultEmployees);
      localStorage.setItem("nalco_employees", JSON.stringify(defaultEmployees));
    }
  }, []);

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get department counts
  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-nalco-green text-white";
      case "in meeting":
        return "bg-nalco-red text-white";
      case "away":
        return "bg-yellow-500 text-white";
      case "on call":
        return "bg-nalco-blue text-white";
      default:
        return "bg-nalco-gray text-white";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/portal")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portal
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-nalco-black">Directory</h1>
            <p className="text-nalco-gray">
              Find contact information for colleagues
            </p>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nalco-gray" />
                <Input
                  placeholder="Search by name, department, or team..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Department Summary */}
        <div className="mb-6 grid gap-6 md:grid-cols-5">
          <Card>
            <CardContent className="flex items-center p-6">
              <Building2 className="h-8 w-8 text-nalco-blue" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Engineering
                </p>
                <p className="text-2xl font-bold text-nalco-black">45</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Building2 className="h-8 w-8 text-nalco-green" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">Product</p>
                <p className="text-2xl font-bold text-nalco-black">12</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Building2 className="h-8 w-8 text-nalco-red" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">Design</p>
                <p className="text-2xl font-bold text-nalco-black">8</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Building2 className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">Sales</p>
                <p className="text-2xl font-bold text-nalco-black">20</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Building2 className="h-8 w-8 text-nalco-gray" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">Marketing</p>
                <p className="text-2xl font-bold text-nalco-black">15</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Directory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-nalco-black">
              <Users className="h-5 w-5 mr-2" />
              Employee Directory
            </CardTitle>
            <CardDescription>
              Contact information for all team members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {employees.map((employee) => (
                <Card
                  key={employee.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-nalco-red/10 text-nalco-red font-medium">
                          {employee.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-nalco-black truncate">
                            {employee.name}
                          </h3>
                          <Badge className={getStatusColor(employee.status)}>
                            {employee.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-nalco-gray mb-1">
                          {employee.position}
                        </p>
                        <p className="text-xs text-nalco-gray mb-3">
                          {employee.department} • {employee.team}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center text-xs text-nalco-gray">
                            <Mail className="h-3 w-3 mr-2" />
                            <span className="truncate">{employee.email}</span>
                          </div>
                          <div className="flex items-center text-xs text-nalco-gray">
                            <Phone className="h-3 w-3 mr-2" />
                            <span>{employee.phone}</span>
                          </div>
                          <div className="flex items-center text-xs text-nalco-gray">
                            <MapPin className="h-3 w-3 mr-2" />
                            <span>{employee.location}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              (window.location.href = `mailto:${employee.email}`)
                            }
                          >
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() =>
                              (window.location.href = `tel:${employee.phone}`)
                            }
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Contacts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-nalco-black">
              Emergency Contacts
            </CardTitle>
            <CardDescription>
              Important contacts for emergencies and general inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <Building2 className="h-8 w-8 text-nalco-red mx-auto mb-2" />
                <h4 className="font-medium text-nalco-black">HR Department</h4>
                <p className="text-sm text-nalco-gray mb-2">
                  Human Resources Support
                </p>
                <p className="text-sm text-nalco-black">+1 (555) 100-1000</p>
                <p className="text-xs text-nalco-gray">hr@company.com</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Building2 className="h-8 w-8 text-nalco-blue mx-auto mb-2" />
                <h4 className="font-medium text-nalco-black">IT Helpdesk</h4>
                <p className="text-sm text-nalco-gray mb-2">
                  Technical Support
                </p>
                <p className="text-sm text-nalco-black">+1 (555) 200-2000</p>
                <p className="text-xs text-nalco-gray">support@company.com</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Building2 className="h-8 w-8 text-nalco-green mx-auto mb-2" />
                <h4 className="font-medium text-nalco-black">Security</h4>
                <p className="text-sm text-nalco-gray mb-2">
                  Emergency & Security
                </p>
                <p className="text-sm text-nalco-black">+1 (555) 911-0000</p>
                <p className="text-xs text-nalco-gray">security@company.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
