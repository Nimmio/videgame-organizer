import { queryOptions } from "@tanstack/react-query";
import prisma from "../prisma";
import { createServerFn } from "@tanstack/react-start";
import { Status } from "@/generated/prisma";

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

const getStatus = createServerFn({ method: "GET" }).handler(async () => {
  await createDefaultStatusIfDontExist();
  return await prisma.status.findMany();
});

export default getStatus;

export const StatusQueryOptions = () =>
  queryOptions({ queryKey: ["status"], queryFn: getStatus });

const createDefaults = async () => {
  await prisma.status.createMany({
    data: DefaultStatus.map((status) => ({ ...status, isDefault: true })),
  });

  await prisma.system.create({
    data: {
      message: "Status Defaults",
    },
  });
};

export const createDefaultStatusIfDontExist = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    await prisma.system.findFirstOrThrow({
      where: {
        message: "Status Defaults",
      },
    });
  } catch (e) {
    createDefaults();
  }
});
