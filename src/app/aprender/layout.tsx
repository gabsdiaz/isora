import { AppShell } from "@/components/AppShell";

export default function Layout({ children }: LayoutProps<"/aprender">) {
  return <AppShell>{children}</AppShell>;
}
