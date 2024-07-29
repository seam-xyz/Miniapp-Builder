
import { useEffect, useState } from 'react';
import { getNftsForOwner } from './utils/AlchemyAPI';
import {
  resolveEnsDomain,
  isEnsDomain
} from './utils/OpenSeaAPI';
import { OwnedNft } from 'alchemy-sdk'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import { ComposerComponentProps, FeedComponentProps } from './types'
import TitleComponent from './utils/TitleComponent';
import './BlockStyles.css'
import { ImageList, ImageListItem, ToggleButton, ToggleButtonGroup } from '@mui/material';

interface NftGridProps {
  /**
   * Ethereum address (`0x...`) or ENS domain (`vitalik.eth`) for which the gallery should contain associated NFTs.
   * Required.
   */
  ownerAddress: string;

  /**
  * Layout option for images.
  * 'grid' and 'list' are valid options.
  * Required.
  */
  imageViewMode: string;


  /**
  * Ethereum address (`0x...`) for an NFT contract to filter to.
  * Optional.
  */

  contract?: string;
}

function NFTGrid(props: NftGridProps) {

  const [assets, setAssets] = useState<OwnedNft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadAssetsPage = async (
      ownerAddress: NftGridProps['ownerAddress'],
    ) => {
      setIsLoading(true);
      setLoadingError(undefined);
      const owner = isEnsDomain(ownerAddress)
        ? await resolveEnsDomain(ownerAddress)
        : ownerAddress;

      if (owner) {
        const {
          assets: rawAssets,
          error,
        } = await getNftsForOwner(owner, props.contract);

        if (!error) {
          // Cast rawAssets to AlchemyAsset[]
          setAssets(rawAssets as OwnedNft[]);
        } else {
          setLoadingError(error);
        }
        setIsLoading(false);
      }
    }

    loadAssetsPage(props.ownerAddress);
  }, [props.ownerAddress, props.contract]);

  const scrollAttribute = "scroll"

  let isEmpty = assets.length === 0 && !isLoading

  const getImageUrl = (asset: OwnedNft) => {
    let imageUrl = '';
    if (asset.media && asset.media[0] && asset.media[0].gateway) {
      imageUrl = asset.media[0].gateway; // Use 'gateway' property
    } else if (asset.rawMetadata && asset.rawMetadata.image) {
      imageUrl = asset.rawMetadata.image;
    } else if (asset.contract.openSea && asset.contract.openSea.imageUrl) {
      // when the original project site has shut down, sometimes opensea has a cached copy of the nft image
      imageUrl = asset.contract.openSea.imageUrl
    } else {
      console.log("unable to find")
      console.log(asset)
    }

    // Convert IPFS URL to a usable format
    if (imageUrl?.startsWith('ipfs://')) {
      imageUrl = `https://ipfs.io/ipfs/${imageUrl.slice(7)}`;
    }

    return imageUrl;
  }

  const GridMode = () => {
    return (
      <ImageList cols={3} style={{ maxHeight: '100%', position: 'absolute', overflow: scrollAttribute }} sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
        {assets.length === 0 && isLoading ? <h1>Loading...</h1> : assets.map((asset, index) =>
          <ImageListItem key={index}>
            <img src={getImageUrl(asset)} key={index} style={{ aspectRatio: 1 }} alt="NFT" loading="lazy" />
          </ImageListItem>
        )}
      </ImageList>
    );
  };

  const ListMode = () => {
    return (
      <div id="scroll" style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%', position: 'absolute', width: '100%', overflowY: scrollAttribute }}>
        {assets.length === 0 && isLoading ? <h1>Loading...</h1> : assets.map((asset, index) =>
          <div style={{ height: '80px', display: 'flex', flexDirection: 'row' }}>
            <img src={getImageUrl(asset)} key={index} style={{ aspectRatio: 1, height: '60px', margin: '10px' }} alt="NFT" loading="lazy" />
            <div style={{ width: '100%', height: '60px', margin: '10px', alignItems: 'center', display: 'flex' }}>#{asset.tokenId}</div>
          </div>
        )}
      </div>
    );
  };

  const EmptyState = () => {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", width: "100%", height: 'calc(100% - 40px)' }}>
        <h3>No NFTs to display</h3>
      </div>
    )
  }

  if (loadingError) {
    return (
      <div style={{ position: "relative", height: '100%', width: "100%", alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
        <div>
          {loadingError}
        </div>
        <br />
        <div>Please try again ♡</div>
      </div>
    )
  }

  return (
    <div style={{ position: "relative", height: 'calc(100% - 40px)', width: "100%" }}>
      {isEmpty && <EmptyState />}
      {props.imageViewMode === "grid" ? <GridMode /> : null}
      {props.imageViewMode === "list" ? <ListMode /> : null}
    </div>
  )
}

export const NFTsFeedComponent = ({ model }: FeedComponentProps) => {
  if (!model.data['imageViewMode']) {
    model.data['imageViewMode'] = 'grid'
  }

  const ownerAddress = model.data["ownerAddress"]
  const contract = model.data["contractAddress"]
  const imageViewMode = model.data['imageViewMode']
  const title = model.data['title']

  return (
    <>
      {title && TitleComponent(title)}
      <NFTGrid ownerAddress={ownerAddress}
        imageViewMode={imageViewMode}
        contract={contract}
      />
    </>
  );
}

export const NFTsComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const onFinish = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    model.data['ownerAddress'] = (data.get('ownerAddress') as string).toLowerCase()
    model.data['contractAddress'] = data.get('contractAddress') as string
    model.data['title'] = data.get('title') as string
    done(model)
  };

  const ImageViewModeToggle = () => {
    const [imageViewMode, setImageViewMode] = useState<string | null>(model.data['imageViewMode']);
    const handleToggleChange = (
      event: React.MouseEvent<HTMLElement>,
      value: string,
    ) => {
      const val = value ?? model.data['imageViewMode']
      model.data['imageViewMode'] = val
      setImageViewMode(val)
    };

    return (
      <div style={{ marginTop: '10px' }}>
        <div style={{ marginBottom: '5px' }}>Image Layout:</div>
        <ToggleButtonGroup
          exclusive
          value={imageViewMode}
          onChange={handleToggleChange}
          id="imageViewMode"
        >
          <ToggleButton value="grid" key="grid" aria-label="grid">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list" key="list" aria-label="list">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={onFinish}
    >
      <TextField
        margin="normal"
        required
        defaultValue={model.data['ownerAddress']}
        fullWidth
        id="ownerAddress"
        label="NFT Wallet Address or ENS"
        name="ownerAddress"
      />
      <TextField
        margin="normal"
        defaultValue={model.data['contractAddress']}
        fullWidth
        id="contractAddress"
        label="NFT contract address (optional)"
        name="contractAddress"
      />
      <TextField
        margin="normal"
        defaultValue={model.data['title'] ?? "My NFTs"}
        fullWidth
        id="title"
        label="Title"
        name="title"
      />
      <ImageViewModeToggle />
      <Button
        type="submit"
        variant="contained"
        className="save-modal-button"
        sx={{ mt: 3, mb: 1 }}
      >
        Save
      </Button>
    </Box>
  )
}
