import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8">
            <div className="text-8xl font-bold text-nalco-red/20">404</div>
            <h1 className="mt-4 text-3xl font-bold text-nalco-black">
              Page Not Found
            </h1>
            <p className="mt-4 text-lg text-nalco-gray">
              Sorry, we couldn't find the page you're looking for. The page may
              have been moved or doesn't exist.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild className="bg-nalco-red hover:bg-nalco-red/90">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>

          <div className="mt-12 rounded-lg bg-nalco-blue/5 p-6">
            <h2 className="mb-2 text-lg font-semibold text-nalco-black">
              Need Help?
            </h2>
            <p className="text-nalco-gray">
              If you believe this is an error, please contact the IT department
              or{" "}
              <Link
                to="/issues"
                className="font-medium text-nalco-red hover:underline"
              >
                report an issue
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
