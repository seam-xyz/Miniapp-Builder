import { Alchemy, Network } from "alchemy-sdk";

const ALCHEMY_API_KEY = process.env.REACT_APP_ALCHEMY_API_KEY; // Replace with your Alchemy API key
const ALCHEMY_NETWORK = Network.ETH_MAINNET; // You can replace this with any network you're working with

const alchemy = new Alchemy({ apiKey: ALCHEMY_API_KEY, network: ALCHEMY_NETWORK });

export const getNftsForOwner = async (
    ownerAddress: string,
    contractAddress?: string
) => {
    try {
        const options = {
            contractAddresses: contractAddress ? [contractAddress] : undefined,
            pageSize: 50, // Mimicking the OpenSea's limit
        };
        const response = await alchemy.nft.getNftsForOwner(ownerAddress, options);

        return {
            assets: response.ownedNfts,
            nextCursor: response.pageKey,
            error: undefined,
        };
    } catch (error) {
        console.error("getNftsForOwner failed:", error);

        // Check if the error is an instance of Error, then access its message property
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

