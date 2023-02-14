
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

import Block from './Block'
import { BlockModel } from './types'


import BlockFactory from './BlockFactory';
import './BlockStyles.css'

interface NftGridProps {
  /**
   * Ethereum address (`0x...`) or ENS domain (`vitalik.eth`) for which the gallery should contain associated NFTs.
   * Required.
   */
  ownerAddress: string;

}
function NFTGrid(props: NftGridProps) {

  const [assets, setAssets] = useState([] as OpenseaAsset[]);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadAssetsPage(props.ownerAddress)
  }, [])

  const loadAssetsPage = async (
    ownerAddress: NftGridProps['ownerAddress'],
  ) => {
    setIsLoading(true);
    const owner = isEnsDomain(ownerAddress)
      ? await resolveEnsDomain(ownerAddress)
      : ownerAddress;

    const contract = ''
    const {
      assets: rawAssets,
      hasError,
      nextCursor,
    } = await fetchOpenseaAssets({
      owner,
      contract

    });
    if (hasError) {
      setHasError(true);
    } else {
      setHasError(false);
      // setAssets((prevAssets) => [...prevAssets, ...rawAssets]);
      setAssets(rawAssets)
    }
    setIsLoading(false);

  }


  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', width: '100%', margin: '0 auto' }}>
      {assets.length === 0 && isLoading ? <h1>Loading...</h1> : assets.map((asset, index) =>
        <img src={asset.image_preview_url} key={index} style={{ width: '100%', aspectRatio: 1 }} />
      )}

    </div>
  )



}
export default class NFTsBlock extends Block {
  render() {
    if (Object.keys(this.model.data).length === 0) {
      return BlockFactory.renderEmptyState(this.model, this.onEditCallback!)
    }

    let ownerAddress = this.model.data["ownerAddress"]

    return (
      <div>
        <NFTGrid ownerAddress={ownerAddress} />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    const onFinish = (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let ownerAddress = data.get('ownerAddress') as string
      this.model.data['ownerAddress'] = ownerAddress
      done(this.model)
    };

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
          label="NFT Wallet Address"
          name="ownerAddress"
        />
        <Button
          type="submit"
          variant="contained"
          className="save-modal-button"
          sx={{ mt: 3, mb: 2 }}
        >
          Save
        </Button>
      </Box>
    )  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}