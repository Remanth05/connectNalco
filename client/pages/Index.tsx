import { Link } from "react-router-dom";
import {
  Users,
  AlertTriangle,
  Building2,
  Shield,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Layout from "@/components/Layout";

export default function Index() {
  const features = [
    {
      icon: Users,
      title: "Employee Portal",
      description:
        "Comprehensive employee management system with all essential services and information in one place.",
      href: "/login",
    },
    {
      icon: AlertTriangle,
      title: "Issue Tracker",
      description:
        "Report, track, and resolve plant issues efficiently with our advanced complaint management system.",
      href: "/login",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Real-time insights and analytics to monitor plant operations and employee productivity.",
      href: "/analytics",
    },
    {
      icon: Shield,
      title: "Safety Management",
      description:
        "Ensure workplace safety with incident reporting, safety protocols, and compliance tracking.",
      href: "/safety",
    },
  ];

  const stats = [
    { label: "Active Employees", value: "2,500+", icon: Users },
    { label: "Issues Resolved", value: "1,200+", icon: CheckCircle },
    { label: "Uptime", value: "99.9%", icon: Clock },
    { label: "Departments", value: "15", icon: Building2 },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Streamlined Operations",
      description:
        "Integrate all plant management functions into one unified platform.",
    },
    {
      icon: Target,
      title: "Improved Efficiency",
      description:
        "Reduce response times and increase productivity across all departments.",
    },
    {
      icon: Globe,
      title: "Digital Transformation",
      description:
        "Modernize NALCO's operations with cutting-edge technology solutions.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-nalco-blue/5 to-nalco-red/10">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-nalco-red/10 px-4 py-2 text-sm font-medium text-nalco-red">
              <Building2 className="mr-2 h-4 w-4" />
              NALCO Damanjodi Plant Management System
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-nalco-red to-nalco-blue mr-4">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-nalco-black lg:text-6xl">
                <span className="bg-gradient-to-r from-nalco-red to-nalco-blue bg-clip-text text-transparent">
                  connect
                </span>
                NALCO
              </h1>
            </div>

            <p className="mb-8 text-xl text-nalco-gray lg:text-2xl">
              Your comprehensive platform for employee management, issue
              tracking, and operational excellence at NALCO Damanjodi.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-nalco-red hover:bg-nalco-red/90"
              >
                <Link to="/login">
                  Access Employee Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Report an Issue</Link>
              </Button>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 mx-auto max-w-6xl">
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-nalco-blue/10 blur-3xl"></div>
            <div className="absolute right-1/4 top-1/4 h-48 w-48 rounded-full bg-nalco-red/10 blur-2xl"></div>
            <div className="absolute bottom-1/4 left-1/4 h-32 w-32 rounded-full bg-nalco-green/10 blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-nalco-black/5">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-red/10">
                    <Icon className="h-6 w-6 text-nalco-red" />
                  </div>
                  <div className="text-3xl font-bold text-nalco-black">
                    {stat.value}
                  </div>
                  <div className="text-sm text-nalco-gray">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-nalco-black lg:text-4xl">
              Powerful Features for Plant Management
            </h2>
            <p className="text-lg text-nalco-gray">
              Everything you need to manage operations, employees, and issues
              efficiently.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group cursor-pointer transition-all hover:shadow-lg hover:shadow-nalco-red/10"
                >
                  <Link to={feature.href}>
                    <CardHeader>
                      <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-red/10 group-hover:bg-nalco-red group-hover:text-white transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-nalco-black">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-nalco-gray">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-br from-nalco-black/5 to-nalco-blue/5 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-nalco-black lg:text-4xl">
              Why Choose connectNALCO?
            </h2>
            <p className="text-lg text-nalco-gray">
              Built specifically for NALCO's operational needs and employee
              requirements.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-nalco-red to-nalco-blue">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-nalco-black">
                    {benefit.title}
                  </h3>
                  <p className="text-nalco-gray">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-nalco-red to-nalco-blue p-8 text-center text-white lg:p-16">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Ready to Transform Your Workflow?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of NALCO employees already using ConnectNalco for
              seamless operations.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/login">Get Started Today</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-nalco-red"
              >
                <Link to="/login">Report Your First Issue</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
