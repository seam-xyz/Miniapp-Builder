// NOTE: You need a local .env file with an alchemy API key otherwise Alchemy will run on the demo network.
// NOTE: The demo network works for most uses, but will rate limit larger wallets if fetching NFTs. 


import { Alchemy, Network, NftFilters } from "alchemy-sdk";
import { all } from "axios";

const ALCHEMY_API_KEY = "t4ylNl-qbBpke7O4A0fZ0Z8DFiPBbCm0" // process.env.REACT_APP_ALCHEMY_API_KEY;
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
export const getTokensForOwnerBackup = async (
  ownerAddress: string,
  contractAddress?: string,
) => {
  try {
    const response = await alchemy.core.getTokenBalances(ownerAddress);

    let rawTokenAssets = response.tokenBalances;
    
    let allAssets = [];
    rawTokenAssets.forEach((token) => {
        alchemy.core.getTokenMetadata(token.contractAddress).then(console.log)
    }, this);
    //let allTokenAssets = await getNftsForOwner(ownerAddress);  
    // If there's a next cursor, fetch the next page
    //if (response.pageKey) {
      //const nextPageAssets = await getNftsForOwner(ownerAddress, contractAddress, response.pageKey);
      //allAssets = allAssets.concat(nextPageAssets.assets);
    //}

    return {
      assets: rawTokenAssets,
      error: undefined,
    };
  } catch (error) {
    console.error("getTokenstsForOwner failed:", error);
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

export const getTokensForOwner2 = async (
  ownerAddress: string,
  contractAddress?: string,
) => {
  try {
    const response = await alchemy.core.getTokenBalances(ownerAddress);

    let rawTokenAssets = response.tokenBalances;
    
    const tokenMetadataPromises = rawTokenAssets.map(async (token) => {
      const tokenMetadata = await alchemy.core.getTokenMetadata(token.contractAddress);
      let balance: string = token.tokenBalance ? BigInt(token.tokenBalance).toString() : '0';
      let decimals = tokenMetadata.decimals || 0;
      balance = (Number(balance) / Math.pow(10, decimals)).toFixed(2);
      return { tokenMetadata, amount: balance};
    });

    const allAssets = await Promise.all(tokenMetadataPromises);

    return {
      assets: allAssets,
      error: undefined,
    };
  } catch (error) {
    console.error("getTokenstsForOwner failed:", error);
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

export const getTokensForOwner = async (
  ownerAddress: string,
  contractAddress?: string,
  pageCursor?: string
) => {
  try {
    const response = await alchemy.core.getTokensForOwner(ownerAddress, { pageKey: pageCursor });

    let rawTokenAssets = response.tokens;
    
    const allAssetsPromise = rawTokenAssets.map((token) => {
      let balance: string = token.balance ? BigInt(Math.round(Number(token.balance))).toString() : '0';
      let decimals = token.decimals || 0;
      balance = (Number(balance) / Math.pow(10, decimals)).toFixed(2);
      return { token: token, amount: balance};
    });

    let allAssets = await Promise.all(allAssetsPromise);
    console.log(response.pageKey)
    console.log(response)
    // If there's a next cursor, fetch the next page
    if (response.pageKey) {
      const nextPageAssets = await getTokensForOwner(ownerAddress, contractAddress, response.pageKey);
      allAssets = allAssets.concat(nextPageAssets.assets);
    }

    return {
      assets: allAssets,
      error: undefined,
    };
  } catch (error) {
    console.error("getTokenstsForOwner failed:", error);
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

export async function getNFTMetadata(nftContractAddress: string, tokenId: string) {
  // Making a call to the Alchemy API to get the metadata
  const response = await alchemy.nft.getNftMetadata(
    nftContractAddress,
    tokenId,
    {}
  );
  return response; // returning the metadata
}
