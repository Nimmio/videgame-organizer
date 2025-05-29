import { readIGDBEnvVars } from "./igdb/auth";

const IgdbEndpointsUrls = {
  game: "https://api.igdb.com/v4/games",
};

interface fetchFuncParams {
  endpoint: string;
  token: string;
  fields: string;
  search: string;
}

export const fetchFunc = async ({
  endpoint,
  token,
  fields,
  search,
}: fetchFuncParams) => {
  const response = await fetch(IgdbEndpointsUrls[endpoint], {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": readIGDBEnvVars().client,
      Authorization: `Bearer ${token}`,
    },
    body: `search "${search}";fields ${fields};`,
  });

  return response;
};
