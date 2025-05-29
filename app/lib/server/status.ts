import prisma from "../prisma";
import { createServerFn } from "@tanstack/react-start";
const getStatus = createServerFn({ method: "GET" }).handler(
  async () => await prisma.status.findMany()
);

export default getStatus;
