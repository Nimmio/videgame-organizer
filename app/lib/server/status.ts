import { queryOptions } from "@tanstack/react-query";
import prisma from "../prisma";
import { createServerFn } from "@tanstack/react-start";
import { Status } from "@/generated/prisma";

type CreateStatus = Omit<Status, "createdAt" | "id" | "isDefault">;

const DefaultStatus: CreateStatus[] = [
  { statusTitle: "Backlog", group: "BACKLOG" },
  { statusTitle: "Playing", group: "PLAYING" },
  { statusTitle: "On-Hold", group: "BACKLOG" },
  { statusTitle: "Completed", group: "FINISHED" },
  { statusTitle: "100% Completed", group: "FINISHED" },
  { statusTitle: "Dropped", group: "DROPPED" },
  { statusTitle: "Wishlist", group: "PLANNED" },
  { statusTitle: "Pre-ordered", group: "PLANNED" },
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
