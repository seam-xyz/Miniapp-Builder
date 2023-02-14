// https://github.com/bkrem/react-nft-gallery/blob/0ddc9b60cf5863229836564fab51430a9222a911/src/api.ts

import { OpenseaAssetsAndNextCursor } from "../types/OpenseaAsset";

export const OPENSEA_API_OFFSET = 50;
const OPENSEA_URL = "https://api.opensea.io";
const ENS_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/ensdomains/ens";
const MAX_AUTO_RETRY_ATTEMPT = 10;
const AUTO_RETRY_ATTEMPT_INTERVAL = 2000;

let requestRetryCount = 0;

export const isEnsDomain = (ownerAddress: string) =>
  ownerAddress.includes(".eth");

export const resolveEnsDomain = async (
  ensDomainName: string
): Promise<string | null> => {
  const query = `
  query lookup($name: String!) {
    domains(where: { name: $name }) {
      resolvedAddress {
        id
      }
    }
  }
  `;
  const variables = { name: ensDomainName };
  try {
    const result = await fetch(ENS_GRAPH_URL, {
      method: "POST",
      body: JSON.stringify({ query, variables }),
    });
    const { data } = await result.json();
    if (!data.domains.length) {
      throw new Error(`Could not resolve ${ensDomainName} via ENS.`);
    }
    const address = data.domains[0].resolvedAddress.id;
    return address;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const delay = (
  fn: () => OpenseaAssetsAndNextCursor | PromiseLike<OpenseaAssetsAndNextCursor>
): Promise<OpenseaAssetsAndNextCursor> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn()), AUTO_RETRY_ATTEMPT_INTERVAL);
  });
};

export const fetchOpenseaAssets = async ({
  owner,
  cursor,
  apiKey,
  apiUrl,
  autoRetry,
  contract,
}: {
  owner: string | null;
  cursor?: string;
  apiKey?: string;
  isProxyApi?: boolean;
  apiUrl?: string;
  autoRetry?: boolean;
  contract?: string;
}): Promise<OpenseaAssetsAndNextCursor> => {
  try {
    console.log("Fetching assets with owner", owner)
    let ownerArg = owner ? "&owner=" + owner : "";
    let contractArg = contract ? "&asset_contract_address=" + contract : "";
    const apiUrlFinal = apiKey
      ? `${
          apiUrl ? apiUrl : OPENSEA_URL
        }/api/v1/assets?limit=50&cursor=${cursor}${ownerArg}${contractArg}`
      : `${
          apiUrl ? apiUrl : OPENSEA_URL
        }/api/v1/assets?${ownerArg}${contractArg}`;
    const result = await fetch(
      apiUrlFinal,
      apiKey ? { headers: { "X-API-KEY": apiKey } } : {}
    );
    if (result.status !== 200) {
      const error = await result.text();
      throw new Error(error);
    }
    const response = await result.json();
    const { assets, next: nextCursor } = response;

    return {
      assets,
      nextCursor,
      hasError: false,
    };
  } catch (error) {
    if (autoRetry && requestRetryCount < MAX_AUTO_RETRY_ATTEMPT) {
      console.log(
        `Failed to fetch assets, retrying in ${
          AUTO_RETRY_ATTEMPT_INTERVAL / 1000
        } seconds...`
      );
      console.log(
        `Retry Count: ${requestRetryCount}/${MAX_AUTO_RETRY_ATTEMPT}`
      );

      requestRetryCount++;

      return delay(() =>
        fetchOpenseaAssets({
          owner,
          cursor,
          apiKey,
          apiUrl,
          autoRetry,
        })
      );
    } else {
      console.error("fetchAssets failed:", error);
      return {
        assets: [],
        nextCursor: "",
        hasError: true,
      };
    }
  }
};
