import { Avatar } from '@mui/material';

function ComposerMiniAppPhoto({ block, size }) {
  return (
    <Avatar style={{ borderRadius: 5, backgroundColor: "gray", height: size, width: size, marginRight: 16 }}>
      <img src={block?.icon} style={{ height: size }} />
    </Avatar>
  )
}

export default ComposerMiniAppPhoto;