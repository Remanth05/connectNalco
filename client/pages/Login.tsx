import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, Building2, Shield, Users } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!formData.employeeId || !formData.password || !formData.role) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      // API call to authenticate user
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: formData.employeeId,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Login failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store auth data using context
      const authData = {
        employeeId: data.data.user.employeeId,
        role: data.data.user.role as "employee" | "authority" | "admin",
        name: data.data.user.name,
        email: data.data.user.email,
        isAuthenticated: true,
        token: data.data.token,
      };

      // Store token for API calls
      localStorage.setItem("token", data.data.token);

      // Use the auth context to log in
      login(authData);

      // Navigate to appropriate dashboard
      const targetPath =
        data.data.user.role === "admin"
          ? "/admin/dashboard"
          : data.data.user.role === "authority"
            ? "/authority/dashboard"
            : "/portal";

      navigate(targetPath);
      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nalco-blue/10 to-nalco-red/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-2 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl overflow-hidden">
                <img
                  src="/logo.jpg"
                  alt="Company Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-nalco-black">
                  <span className="text-nalco-red">connect</span>NALCO
                </h1>
                <p className="text-sm text-nalco-blue font-medium">
                  Digital Workplace Portal
                </p>
              </div>
            </div>
          </div>
          <p className="text-xl text-nalco-gray mb-8">
            Modern employee management system for NALCO operations
          </p>

          {/* Role Selection Buttons */}
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto p-4 hover:bg-nalco-blue/10 hover:border-nalco-blue transition-all"
              onClick={() => setFormData({ ...formData, role: "employee" })}
            >
              <div className="text-center">
                <User className="h-8 w-8 text-nalco-blue mx-auto mb-2" />
                <h3 className="font-medium text-nalco-black">Employee</h3>
                <p className="text-sm text-nalco-gray">
                  Access personal services
                </p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 hover:bg-nalco-green/10 hover:border-nalco-green transition-all"
              onClick={() => setFormData({ ...formData, role: "authority" })}
            >
              <div className="text-center">
                <Shield className="h-8 w-8 text-nalco-green mx-auto mb-2" />
                <h3 className="font-medium text-nalco-black">Authority</h3>
                <p className="text-sm text-nalco-gray">Manage departments</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 hover:bg-nalco-red/10 hover:border-nalco-red transition-all"
              onClick={() => setFormData({ ...formData, role: "admin" })}
            >
              <div className="text-center">
                <Users className="h-8 w-8 text-nalco-red mx-auto mb-2" />
                <h3 className="font-medium text-nalco-black">Admin</h3>
                <p className="text-sm text-nalco-gray">System administration</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nalco-red/10">
              <Building2 className="h-8 w-8 text-nalco-red" />
            </div>
            <CardTitle className="text-2xl text-nalco-black">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to access your dashboard and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="role">Select Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Employee
                      </div>
                    </SelectItem>
                    <SelectItem value="authority">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Authority
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Administrator
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nalco-gray" />
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="Enter your Employee ID"
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nalco-gray" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-nalco-red hover:bg-nalco-red/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-nalco-gray/10 rounded-lg">
              <h4 className="font-medium text-nalco-black mb-2">
                Demo Credentials:
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Employee</Badge>
                  <span className="text-nalco-gray">EMP001 / emp123</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Authority</Badge>
                  <span className="text-nalco-gray">AUTH001 / auth123</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Admin</Badge>
                  <span className="text-nalco-gray">ADMIN001 / admin123</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-nalco-gray">
              <p>Need help? Contact IT Support</p>
              <p className="text-nalco-blue">support@nalco.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
