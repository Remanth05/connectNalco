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

export default function Directory() {
  const navigate = useNavigate();

  const employees = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Senior Software Engineer",
      department: "Engineering",
      team: "Frontend Development",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      location: "New York Office",
      avatar: "SJ",
      status: "Available",
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Product Manager",
      department: "Product",
      team: "Core Platform",
      email: "michael.chen@company.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco Office",
      avatar: "MC",
      status: "In Meeting",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "UX Designer",
      department: "Design",
      team: "User Experience",
      email: "emily.rodriguez@company.com",
      phone: "+1 (555) 345-6789",
      location: "Remote",
      avatar: "ER",
      status: "Available",
    },
    {
      id: 4,
      name: "David Thompson",
      position: "DevOps Engineer",
      department: "Engineering",
      team: "Infrastructure",
      email: "david.thompson@company.com",
      phone: "+1 (555) 456-7890",
      location: "Austin Office",
      avatar: "DT",
      status: "Away",
    },
    {
      id: 5,
      name: "Lisa Wang",
      position: "Marketing Director",
      department: "Marketing",
      team: "Growth Marketing",
      email: "lisa.wang@company.com",
      phone: "+1 (555) 567-8901",
      location: "New York Office",
      avatar: "LW",
      status: "Available",
    },
    {
      id: 6,
      name: "James Miller",
      position: "Sales Representative",
      department: "Sales",
      team: "Enterprise Sales",
      email: "james.miller@company.com",
      phone: "+1 (555) 678-9012",
      location: "Chicago Office",
      avatar: "JM",
      status: "On Call",
    },
  ];

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
