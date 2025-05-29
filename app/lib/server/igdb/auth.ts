import { IGDBAuth } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { addSeconds, isAfter } from "date-fns";

type saveIGDBAuth = Omit<IGDBAuth, "id" | "updatedAt">;

export const readIGDBEnvVars = (): { client: string; secret: string } => {
  const { IGDB_CLIENT_ID: client, IGDB_CLIENT_SECRET: secret } = process.env;
  if (!client || !secret) {
    throw new Error("Missing IGDB Env Variables");
  }
  return {
    client,
    secret,
  };
};

const requestNewAuthentication = async (): Promise<{
  token: string;
  expireDate: Date;
}> => {
  const { client, secret } = readIGDBEnvVars();
  const url = `https://id.twitch.tv/oauth2/token?client_id=${client}&client_secret=${secret}&grant_type=client_credentials`;

  const response = await fetch(url, {
    method: "POST",
  });

  const { access_token, expires_in } = await response.json();
  const currentDate = new Date();
  const expireDate = addSeconds(currentDate, expires_in);
  return {
    token: access_token,
    expireDate,
  };
};

const saveAuthentication = async ({
  input,
}: {
  input: saveIGDBAuth;
}): Promise<IGDBAuth> => {
  return await prisma.iGDBAuth.upsert({
    create: {
      ...input,
      updatedAt: new Date(),
    },
    update: {
      ...input,
      updatedAt: new Date(),
    },
    where: {
      id: 1,
    },
  });
};

const readIGDBFromDB = async (): Promise<IGDBAuth | null> => {
  return await prisma.iGDBAuth.findFirst({
    where: {
      id: 1,
    },
  });
};

const igdbAuthExistsAndIsNotExpired = async (): Promise<boolean> => {
  const iGDBAuth = await readIGDBFromDB();

  if (!iGDBAuth || !iGDBAuth.access_token || !iGDBAuth.expires) return false;
  if (isAfter(new Date(), iGDBAuth.expires)) return false;
  return true;
};

export const getAuthentication = async (): Promise<IGDBAuth> => {
  if (await igdbAuthExistsAndIsNotExpired()) {
    return (await readIGDBFromDB()) as IGDBAuth;
  } else {
    const { token: access_token, expireDate: expires } =
      await requestNewAuthentication();
    const savedAuth = await saveAuthentication({
      input: { access_token, expires },
    });
    return savedAuth;
  }
};
