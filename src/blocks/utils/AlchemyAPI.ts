// NOTE: You need a local .env file with an alchemy API key otherwise Alchemy will run on the demo network.
// NOTE: The demo network works for most uses, but will rate limit larger wallets if fetching NFTs. 


// import { Alchemy, Network, NftFilters } from "alchemy-sdk";

// const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY ?? "demo";
// const ALCHEMY_NETWORK = Network.ETH_MAINNET;

// const alchemy = new Alchemy({ apiKey: ALCHEMY_API_KEY, network: ALCHEMY_NETWORK });

// export const getNftsForOwner = async (
//   ownerAddress: string,
//   contractAddress?: string,
//   pageCursor?: string
// ) => {
//   try {
//     const options = {
//       contractAddresses: contractAddress ? [contractAddress] : undefined,
//       pageSize: 50,
//       excludeFilters: [NftFilters.SPAM, NftFilters.AIRDROPS],
//       pageKey: pageCursor // Use the cursor for pagination
//     };
//     const response = await alchemy.nft.getNftsForOwner(ownerAddress, options);

//     let allAssets = response.ownedNfts;

//     // If there's a next cursor, fetch the next page
//     if (response.pageKey) {
//       const nextPageAssets = await getNftsForOwner(ownerAddress, contractAddress, response.pageKey);
//       allAssets = allAssets.concat(nextPageAssets.assets);
//     }

//     return {
//       assets: allAssets,
//       nextCursor: response.pageKey,
//       error: undefined,
//     };
//   } catch (error) {
//     console.error("getNftsForOwner failed:", error);
//     let errorMessage: string;
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     } else {
//       errorMessage = "An unknown error occurred.";
//     }

//     return {
//       assets: [],
//       nextCursor: "",
//       error: errorMessage,
//     };
//   }
// }



// export const getTokensForOwner = async (
//   ownerAddress: string,
//   contractAddress?: string,
//   pageCursor?: string
// ) => {
//   try {
//     const response = await alchemy.core.getTokensForOwner(ownerAddress, { pageKey: pageCursor });

//     let rawTokenAssets = response.tokens;
    
//     const allAssetsPromise = rawTokenAssets.map((token) => {
//       let balance = token.balance ? BigInt(Math.round(Number(token.rawBalance))) : 0;
//       let decimals = token.decimals ? token.decimals : 0;
//       let balanceDec = (Number(balance) / Math.pow(10, decimals)).toFixed(2);
//       return { token: token, amount: balanceDec};
//     });

//     let allAssets = await Promise.all(allAssetsPromise);

//     return {
//       assets: allAssets,
//       error: undefined,
//     };
//   } catch (error) {
//     console.error("getTokenstsForOwner failed:", error);
//     let errorMessage: string;
//     if (error instanceof Error) {
//       errorMessage = error.message;
//     } else {
//       errorMessage = "An unknown error occurred.";
//     }

//     return {
//       assets: [],
//       nextCursor: "",
//       error: errorMessage,
//     };
//   }
// }

// export async function getNFTMetadata(nftContractAddress: string, tokenId: string) {
//   // Making a call to the Alchemy API to get the metadata
//   const response = await alchemy.nft.getNftMetadata(
//     nftContractAddress,
//     tokenId,
//     {}
//   );
//   return response; // returning the metadata
// }
