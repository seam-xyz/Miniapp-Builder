
import React, { CSSProperties, useEffect, useState, useCallback } from 'react';
import {
  fetchOpenseaAssets,
  OPENSEA_API_OFFSET,
  resolveEnsDomain,
  isEnsDomain
} from './utils/OpenSeaAPI';
import { OpenseaAsset } from './types/OpenseaAsset';

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
  })


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
      nextCursor,
    } = await fetchOpenseaAssets({
      owner,
    });
    if (hasError) {
      setHasError(true);
    } else {
      setHasError(false);
      setAssets((prevAssets) => [...prevAssets, ...rawAssets]);
    }
    setIsLoading(false);

  }


  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
      {assets.length === 0 && isLoading ? <h1>Loading...</h1> : assets.map((asset) =>
        <img src={asset.image_preview_url} style={{ width: '100%' }} />
      )}

    </div>
  )



}
export default class NFTsBlock extends Block {
  render() {
    return (
      <div>
        <h1>nfts Block!</h1>
        <NFTGrid ownerAddress='0x6cbd72900b2e1d6286b108c7d45e41660b6c3195' />
      </div>
    );
  }

  renderEditModal(done: (data: BlockModel) => void) {
    return (
      <h1>Edit nfts Block!</h1>
    )
  }

  renderErrorState() {
    return (
      <h1>Error!</h1>
    )
  }
}