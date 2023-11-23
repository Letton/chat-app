import { getServerSession } from "next-auth/next";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Чаты",
};

export default async function ApplicationPage() {
  const session = await getServerSession();

  return <div className="break-all">{JSON.stringify(session)}</div>;
}
