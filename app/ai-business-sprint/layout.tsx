import SiteLegalFooter from "@/components/legal/SiteLegalFooter";

export default function AiBusinessSprintStatusLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <SiteLegalFooter />
    </>
  );
}
