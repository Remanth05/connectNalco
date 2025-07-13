import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
} from "lucide-react";

export default function Settings() {
  const settingsCategories = [
    {
      icon: User,
      title: "Profile Settings",
      description: "Manage your personal information and preferences",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure email and push notification settings",
    },
    {
      icon: Shield,
      title: "Security",
      description: "Password, two-factor authentication, and privacy",
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize theme, language, and display options",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-nalco-black">Settings</h1>
          <p className="text-nalco-gray">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {settingsCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={index}
                className="cursor-pointer transition-all hover:shadow-lg hover:shadow-nalco-red/10"
              >
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-nalco-red/10">
                    <Icon className="h-6 w-6 text-nalco-red" />
                  </div>
                  <CardTitle className="text-nalco-black">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-nalco-gray">
                    {category.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
