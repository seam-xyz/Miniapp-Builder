// AlchemyAsset.ts

export interface AlchemyMedia {
    uri: string;
    [key: string]: any;
  }
  
  export interface AlchemyAsset {
    contract: any;
    tokenId: string;
    tokenType: 'ERC721' | 'ERC1155';
    title: string;
    description: string;
    timeLastUpdated: string;
    metadataError?: string;
    rawMetadata: any;
    tokenUri: any;
    media: AlchemyMedia[];
    spamInfo: any;
    balance: number;
    acquiredAt?: {
      blockTimestamp: string;
      blockNumber: number;
    };
    [key: string]: any;
  }
  