import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TransactionDialog from "./_components/TransactionDialog";
import Overview from "./_components/Overview";
import History from "./_components/History";

const Dashboard = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) redirect("/wizard");

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold">Hello, {user.firstName}! 👋</h2>

          <div className="flex items-center gap-3">
            <TransactionDialog
              trigger={
                <Button className="border-emerald-500 bg-emerald-950 border text-white hover:bg-emerald-700 hover:text-white">
                  New income 😃
                </Button>
              }
              type="income"
            />

            <TransactionDialog
              trigger={
                <Button className="border-rose-500 bg-rose-950 border text-white hover:bg-rose-700 hover:text-white">
                  New expense 🥲
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>

      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
};
export default Dashboard;
