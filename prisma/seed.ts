import { Status } from "@/generated/prisma";
import prisma from "@/lib/prisma";

type CreateStatus = Omit<Status, "createdAt" | "id" | "isDefault">;
const DefaultStatus: CreateStatus[] = [
  { statusTitle: "Backlog" },
  { statusTitle: "Playing" },
  { statusTitle: "On-Hold" },
  { statusTitle: "Completed" },
  { statusTitle: "100% Completed" },
  { statusTitle: "Dropped" },
  { statusTitle: "Wishlist" },
  { statusTitle: "Pre-ordered" },
];

async function main() {
  console.log("start seed");
  // await prisma.status.createMany({
  //   data: DefaultStatus.map((status) => ({ ...status, isDefault: true })),
  // });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
