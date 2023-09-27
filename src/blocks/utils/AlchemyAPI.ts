// NOTE: You need a local .env file with an alchemy API key otherwise Alchemy will run on the demo network.
// NOTE: The demo network works for most uses, but will rate limit larger wallets if fetching NFTs. 


import { Alchemy, Network, NftFilters } from "alchemy-sdk";

const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY;
const ALCHEMY_NETWORK = Network.ETH_MAINNET;

const alchemy = new Alchemy({ apiKey: ALCHEMY_API_KEY, network: ALCHEMY_NETWORK });

export const getNftsForOwner = async (
  ownerAddress: string,
  contractAddress?: string,
  pageCursor?: string
) => {
  try {
    const options = {
      contractAddresses: contractAddress ? [contractAddress] : undefined,
      pageSize: 50,
      excludeFilters: [NftFilters.SPAM, NftFilters.AIRDROPS],
      pageKey: pageCursor // Use the cursor for pagination
    };
    const response = await alchemy.nft.getNftsForOwner(ownerAddress, options);

    let allAssets = response.ownedNfts;

    // If there's a next cursor, fetch the next page
    if (response.pageKey) {
      const nextPageAssets = await getNftsForOwner(ownerAddress, contractAddress, response.pageKey);
      allAssets = allAssets.concat(nextPageAssets.assets);
    }

    return {
      assets: allAssets,
      nextCursor: response.pageKey,
      error: undefined,
    };
  } catch (error) {
    console.error("getNftsForOwner failed:", error);
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred.";
    }

    return {
      assets: [],
      nextCursor: "",
      error: errorMessage,
    };
  }
}


