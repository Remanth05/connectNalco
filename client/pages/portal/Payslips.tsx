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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Download, Eye, Search, Loader2, X } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export default function Payslips() {
  const navigate = useNavigate();

  const payslips = [
    {
      id: "PS-2024-03",
      month: "March 2024",
      grossSalary: 114500,
      netSalary: 86150,
      date: "2024-03-31",
      status: "Available",
    },
    {
      id: "PS-2024-02",
      month: "February 2024",
      grossSalary: 112000,
      netSalary: 84200,
      date: "2024-02-29",
      status: "Available",
    },
    {
      id: "PS-2024-01",
      month: "January 2024",
      grossSalary: 110000,
      netSalary: 82500,
      date: "2024-01-31",
      status: "Available",
    },
    {
      id: "PS-2023-12",
      month: "December 2023",
      grossSalary: 118000,
      netSalary: 88900,
      date: "2023-12-31",
      status: "Available",
    },
  ];

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleViewPayslip = (payslip: any) => {
    setSelectedPayslip(payslip);
    setViewDialogOpen(true);
  };

  const handleDownloadPayslip = async (payslip: any) => {
    setDownloading(payslip.id);
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a mock PDF blob
      const pdfContent = `Payslip for ${payslip.month}\nEmployee: John Doe\nGross Salary: ${formatCurrency(payslip.grossSalary)}\nNet Salary: ${formatCurrency(payslip.netSalary)}`;
      const blob = new Blob([pdfContent], { type: 'application/pdf' });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslip-${payslip.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(null);
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
            <h1 className="text-3xl font-bold text-nalco-black">Payslips</h1>
            <p className="text-nalco-gray">
              Download your salary slips and tax documents
            </p>
          </div>
        </div>

        {/* Current Month Summary */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <FileText className="h-8 w-8 text-nalco-green" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Gross Salary
                </p>
                <p className="text-2xl font-bold text-nalco-black">
                  {formatCurrency(114500)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <FileText className="h-8 w-8 text-nalco-blue" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Net Salary
                </p>
                <p className="text-2xl font-bold text-nalco-black">
                  {formatCurrency(86150)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <FileText className="h-8 w-8 text-nalco-red" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">
                  Total Deductions
                </p>
                <p className="text-2xl font-bold text-nalco-black">
                  {formatCurrency(28350)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <FileText className="h-8 w-8 text-nalco-gray" />
              <div className="ml-4">
                <p className="text-sm font-medium text-nalco-gray">Tax (YTD)</p>
                <p className="text-2xl font-bold text-nalco-black">
                  {formatCurrency(55500)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-nalco-black">Filter Payslips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="year">Year</Label>
                <Select defaultValue="2024">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="month">Month</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01">January</SelectItem>
                    <SelectItem value="02">February</SelectItem>
                    <SelectItem value="03">March</SelectItem>
                    <SelectItem value="04">April</SelectItem>
                    <SelectItem value="05">May</SelectItem>
                    <SelectItem value="06">June</SelectItem>
                    <SelectItem value="07">July</SelectItem>
                    <SelectItem value="08">August</SelectItem>
                    <SelectItem value="09">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payslips List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-nalco-black">
              Available Payslips
            </CardTitle>
            <CardDescription>
              Download or view your salary slips and tax documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payslips.map((payslip) => (
                <div
                  key={payslip.id}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-green/10">
                      <FileText className="h-6 w-6 text-nalco-green" />
                    </div>
                    <div>
                      <h4 className="font-medium text-nalco-black">
                        {payslip.month}
                      </h4>
                      <p className="text-sm text-nalco-gray">
                        Gross: {formatCurrency(payslip.grossSalary)} • Net:{" "}
                        {formatCurrency(payslip.netSalary)}
                      </p>
                      <p className="text-xs text-nalco-gray">
                        Generated on {payslip.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-nalco-green text-white">
                      {payslip.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPayslip(payslip);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="bg-nalco-blue hover:bg-nalco-blue/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPayslip(payslip);
                      }}
                      disabled={downloading === payslip.id}
                    >
                      {downloading === payslip.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tax Documents */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-nalco-black">Tax Documents</CardTitle>
            <CardDescription>Annual tax statements and forms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-red/10">
                    <FileText className="h-6 w-6 text-nalco-red" />
                  </div>
                  <div>
                    <h4 className="font-medium text-nalco-black">
                      Form W-2 - 2023
                    </h4>
                    <p className="text-sm text-nalco-gray">
                      Annual wage and tax statement
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-nalco-green text-white">Available</Badge>
                  <Button
                    size="sm"
                    className="bg-nalco-red hover:bg-nalco-red/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-red/10">
                    <FileText className="h-6 w-6 text-nalco-red" />
                  </div>
                  <div>
                    <h4 className="font-medium text-nalco-black">
                      Form 1095-C - 2023
                    </h4>
                    <p className="text-sm text-nalco-gray">
                      Employer-provided health insurance offer
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-nalco-green text-white">Available</Badge>
                  <Button
                    size="sm"
                    className="bg-nalco-red hover:bg-nalco-red/90"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payslip View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Payslip Details - {selectedPayslip?.month}</span>
              </DialogTitle>
              <DialogDescription>
                Detailed breakdown of your salary for {selectedPayslip?.month}
              </DialogDescription>
            </DialogHeader>

            {selectedPayslip && (
              <div className="space-y-6">
                {/* Header Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Employee Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Employee ID:</strong> EMP001</p>
                      <p><strong>Name:</strong> John Doe</p>
                      <p><strong>Department:</strong> Engineering</p>
                      <p><strong>Designation:</strong> Senior Engineer</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Pay Period</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Month:</strong> {selectedPayslip.month}</p>
                      <p><strong>Pay Date:</strong> {selectedPayslip.date}</p>
                      <p><strong>Working Days:</strong> 22</p>
                      <p><strong>Days Present:</strong> 20</p>
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div>
                  <h4 className="font-medium mb-3">Earnings</h4>
                  <div className="border rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Basic Salary</span>
                        <span>{formatCurrency(selectedPayslip.grossSalary * 0.6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HRA</span>
                        <span>{formatCurrency(selectedPayslip.grossSalary * 0.2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Special Allowance</span>
                        <span>{formatCurrency(selectedPayslip.grossSalary * 0.15)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medical Allowance</span>
                        <span>{formatCurrency(selectedPayslip.grossSalary * 0.05)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Gross Salary</span>
                        <span>{formatCurrency(selectedPayslip.grossSalary)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-medium mb-3">Deductions</h4>
                  <div className="border rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>PF</span>
                        <span>{formatCurrency((selectedPayslip.grossSalary - selectedPayslip.netSalary) * 0.4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ESI</span>
                        <span>{formatCurrency((selectedPayslip.grossSalary - selectedPayslip.netSalary) * 0.1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Income Tax</span>
                        <span>{formatCurrency((selectedPayslip.grossSalary - selectedPayslip.netSalary) * 0.5)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Deductions</span>
                        <span>{formatCurrency(selectedPayslip.grossSalary - selectedPayslip.netSalary)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="bg-nalco-green/10 border border-nalco-green rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Net Pay</span>
                    <span className="text-2xl font-bold text-nalco-green">
                      {formatCurrency(selectedPayslip.netSalary)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                className="bg-nalco-blue hover:bg-nalco-blue/90"
                onClick={() => {
                  if (selectedPayslip) {
                    handleDownloadPayslip(selectedPayslip);
                  }
                }}
                disabled={downloading === selectedPayslip?.id}
              >
                {downloading === selectedPayslip?.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
