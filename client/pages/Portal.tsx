import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  FileText,
  CreditCard,
  Users,
  Settings,
  Clock,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Portal() {
  const navigate = useNavigate();

  const services = [
    {
      icon: User,
      title: "My Profile",
      description: "View and update your personal information",
      href: "/portal/profile",
    },
    {
      icon: Calendar,
      title: "Leave Management",
      description: "Apply for leave and track your applications",
      href: "/portal/leave",
    },
    {
      icon: FileText,
      title: "Payslips",
      description: "Download your salary slips and tax documents",
      href: "/portal/payslips",
    },
    {
      icon: CreditCard,
      title: "Reimbursements",
      description: "Submit and track expense reimbursements",
      href: "/portal/reimbursements",
    },
    {
      icon: Clock,
      title: "Attendance",
      description: "View your attendance and working hours",
      href: "/portal/attendance",
    },
    {
      icon: Users,
      title: "Directory",
      description: "Find contact information for colleagues",
      href: "/portal/directory",
    },
    {
      icon: Building2,
      title: "Facilities",
      description: "Book meeting rooms and facilities",
      href: "/portal/facilities",
    },
    {
      icon: Settings,
      title: "Preferences",
      description: "Manage your account settings",
      href: "/portal/settings",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-nalco-black">
            Employee Portal
          </h1>
          <p className="text-nalco-gray">
            Access all your employee services and information in one place.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <Calendar className="h-8 w-8 text-nalco-red" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Leave Balance
                </p>
                <p className="text-2xl font-bold text-nalco-black">12 days</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Clock className="h-8 w-8 text-nalco-blue" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  This Month
                </p>
                <p className="text-2xl font-bold text-nalco-black">160 hrs</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <FileText className="h-8 w-8 text-nalco-green" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Pending Tasks
                </p>
                <p className="text-2xl font-bold text-nalco-black">3</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-nalco-red" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">Team Size</p>
                <p className="text-2xl font-bold text-nalco-black">24</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group cursor-pointer transition-all hover:shadow-lg hover:shadow-nalco-red/10"
                onClick={() => navigate(service.href)}
              >
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-red/10 group-hover:bg-nalco-red group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-nalco-black">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-nalco-gray">
                    {service.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(service.href);
                    }}
                  >
                    Access Service
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-nalco-black">
            Recent Activity
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-nalco-blue" />
                    <span className="ml-3 text-nalco-black">
                      Leave application submitted
                    </span>
                  </div>
                  <span className="text-sm text-nalco-gray">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-nalco-green" />
                    <span className="ml-3 text-nalco-black">
                      Payslip for March 2024 available
                    </span>
                  </div>
                  <span className="text-sm text-nalco-gray">1 day ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-nalco-red" />
                    <span className="ml-3 text-nalco-black">
                      Reimbursement approved
                    </span>
                  </div>
                  <span className="text-sm text-nalco-gray">3 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
