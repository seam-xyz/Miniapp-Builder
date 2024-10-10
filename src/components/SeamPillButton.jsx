const SeamPillButton = ({ icon, label, onClick, textColor, colorOverride, isOnChannelPage, }) => {
  return (
    <div
      onClick={onClick}
      className={`${isOnChannelPage && `bg-${textColor} bg-opacity-20`} flex border border-black/10 items-center w-auto h-[40px] cursor-pointer rounded-full`}
      style={{
        backgroundColor: colorOverride && colorOverride, // Use `colorOverride` if provided, else fallback to default color
      }}
    >
      <div className={`flex flex-row items-center justify-center space-x-2 m-3`}>
      {icon}
      {label && <h4 className={`text-${textColor} text-center leading-normal font-normal`}>{label}</h4>}
      </div>
    </div>
  );
};

export default SeamPillButton;