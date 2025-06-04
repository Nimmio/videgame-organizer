import { queryOptions } from "@tanstack/react-query";
import prisma from "../prisma";
import { createServerFn } from "@tanstack/react-start";
import { Status } from "@/generated/prisma";

type CreateStatus = Omit<Status, "createdAt" | "isDefault">;

const DefaultStatus: CreateStatus[] = [
  { id: 1, statusTitle: "Backlog", group: "BACKLOG" },
  { id: 2, statusTitle: "Playing", group: "PLAYING" },
  { id: 3, statusTitle: "On-Hold", group: "BACKLOG" },
  { id: 4, statusTitle: "Completed", group: "FINISHED" },
  { id: 5, statusTitle: "100% Completed", group: "FINISHED" },
  { id: 6, statusTitle: "Dropped", group: "DROPPED" },
  { id: 7, statusTitle: "Wishlist", group: "PLANNED" },
  { id: 8, statusTitle: "Pre-ordered", group: "PLANNED" },
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
