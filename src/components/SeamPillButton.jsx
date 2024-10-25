const SeamPillButton = ({ icon, label, onClick, darkMode, colorOverride, isOnChannelPage, }) => {
  let color = darkMode ? 'white' : 'black';

  return (
    <div
      onClick={onClick}
      className={`${isOnChannelPage && `bg-${color} bg-opacity-20`} flex border border-black/10 items-center w-auto h-[40px] cursor-pointer rounded-full`}
      style={{
        backgroundColor: colorOverride && colorOverride, // Use `colorOverride` if provided, else fallback to default color
      }}
    >
      <div className={`flex flex-row items-center justify-center space-x-2 m-3`}>
      {icon}
      {label && <h4 className={`text-${color} text-center leading-normal font-normal`}>{label}</h4>}
      </div>
    </div>
  );
};

export default SeamPillButton;