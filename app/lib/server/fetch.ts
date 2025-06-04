import { readIGDBEnvVars } from "./igdb/auth";

const IgdbEndpointsUrls = {
  game: "https://api.igdb.com/v4/games",
  platform: "https://api.igdb.com/v4/platforms/",
};

interface fetchFuncParams {
  endpoint: string;
  token: string;
  fields: string;
  search: string;
  extra?: string;
}

export const fetchFunc = async ({
  endpoint,
  token,
  fields,
  search,
  extra = "",
}: fetchFuncParams) => {
  const response = await fetch(IgdbEndpointsUrls[endpoint], {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": readIGDBEnvVars().client,
      Authorization: `Bearer ${token}`,
    },
    body: `search "${search}";fields ${fields};${extra}`,
  });

  return response;
};

interface fetchGameParams {
  endpoint: string;
  token: string;
  fields: string;
  id: number;
}

export const fetchGame = async ({
  endpoint,
  token,
  fields,
  id,
}: fetchGameParams) => {
  const response = await fetch(IgdbEndpointsUrls[endpoint], {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": readIGDBEnvVars().client,
      Authorization: `Bearer ${token}`,
    },
    body: `fields ${fields}; where id = ${id}; limit 1;`,
  });
  return response;
};
