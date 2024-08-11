const SeamPillButton = ({ icon, label, onClick, colorOverride }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-3 py-2 gap-2 rounded-full cursor-pointer border-0"
      style={{
        borderRadius: '43px',
        backgroundColor: colorOverride ? colorOverride : '#EFEFEF', // Use `colorOverride` if provided, else fallback to default color
      }}
    >
      {icon}
      {label && <span className="text-black text-sm leading-normal font-normal">{label}</span>}
    </button>
  );
};

export default SeamPillButton;