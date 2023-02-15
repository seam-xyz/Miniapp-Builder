
import { useEffect, useState } from 'react';
import {
  fetchOpenseaAssets,
  resolveEnsDomain,
  isEnsDomain
} from './utils/OpenSeaAPI';
import { OpenseaAsset } from './types/OpenseaAsset';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import Block from './Block'
import { BlockModel } from './types'

import BlockFactory from './BlockFactory';
import './BlockStyles.css'
import { ImageList, ImageListItem, ToggleButton, ToggleButtonGroup } from '@mui/material';

export const PIXELS_FARM_CONTRACT = "0x5C1A0CC6DAdf4d0fB31425461df35Ba80fCBc110"

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

  const [assets, setAssets] = useState([] as OpenseaAsset[]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAssetsPage = async (
      ownerAddress: NftGridProps['ownerAddress'],
    ) => {
      setIsLoading(true);
      const owner = isEnsDomain(ownerAddress)
        ? await resolveEnsDomain(ownerAddress)
        : ownerAddress;

      const {
        assets: rawAssets,
        hasError,
      } = await fetchOpenseaAssets({
        owner,
        contract: props.contract

      });
      if (!hasError) {
        setAssets(rawAssets)
      }
      setIsLoading(false);

    }

    loadAssetsPage(props.ownerAddress)
  }, [props])

  const GridMode = () => {
    return (
      <ImageList cols={2} style={{ maxHeight: '100%', position: 'absolute' }}>
        {assets.length === 0 && isLoading ? <h1>Loading...</h1> : assets.map((asset, index) =>
          <ImageListItem key={index}>
            <img src={asset.image_preview_url} key={index} style={{ aspectRatio: 1 }} alt="NFT" loading="lazy" />
          </ImageListItem>
        )}
      </ImageList>
    )
  };

  const ListMode = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%', position: 'absolute', width: '100%', overflowY: 'auto' }}>
        {assets.length === 0 && isLoading ? <h1>Loading...</h1> : assets.map((asset, index) =>
          <div style={{ height: '80px', display: 'flex', flexDirection: 'row' }}>
            <img src={asset.image_preview_url} key={index} style={{ aspectRatio: 1, height: '60px', margin: '10px' }} alt="NFT" loading="lazy" />
            <div style={{ width: '100%', height: '60px', margin: '10px', alignItems: 'center', display: 'flex' }}>#{asset.token_id}</div>
          </div>
        )}

      </div>
    )
  }

  return (
    <div style={{ position: "relative", height: '100%', width: "100%" }}>
      {props.imageViewMode === "grid" ? <GridMode /> : null}
      {props.imageViewMode === "list" ? <ListMode /> : null}
    </div>
  )
}

export default class NFTsBlock extends Block {

  render() {
    if (!this.model.data['imageViewMode']) {
      this.model.data['imageViewMode'] = 'grid'
    }
    if (Object.keys(this.model.data).length === 0 || !this.model.data['ownerAddress']) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    const ownerAddress = this.model.data["ownerAddress"]
    const contract = this.model.data["contractAddress"]
    const imageViewMode = this.model.data['imageViewMode']

    return (
      <NFTGrid ownerAddress={ownerAddress} imageViewMode={imageViewMode} contract={contract} />
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      this.model.data['ownerAddress'] = data.get('ownerAddress') as string
      this.model.data['contractAddress'] = data.get('contractAddress') as string
      done(this.model)
    };

    const ImageViewModeToggle = () => {
      const [imageViewMode, setImageViewMode] = useState<string | null>(this.model.data['imageViewMode']);
      const handleToggleChange = (
        event: React.MouseEvent<HTMLElement>,
        value: string,
      ) => {
        const val = value ?? this.model.data['imageViewMode']
        this.model.data['imageViewMode'] = val
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
        style={{}}
      >
        <TextField
          margin="normal"
          required
          defaultValue={this.model.data['ownerAddress']}
          fullWidth
          id="ownerAddress"
          label="NFT Wallet Address or ENS"
          name="ownerAddress"
        />
        <TextField
          defaultValue={this.model.data['contractAddress']}
          fullWidth
          id="contractAddress"
          label="NFT contract address (optional)"
          name="contractAddress"
        />
        <ImageViewModeToggle />
        <Button
          type="submit"
          variant="contained"
          className="save-modal-button"
          sx={{ mt: 3, mb: 2 }}
        >
          Save
        </Button>
      </Box>
    )
  }

  renderErrorState() {
    return (
      <h1>Error loading NFT Block</h1>
    )
  }
}