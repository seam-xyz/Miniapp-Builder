export default function DesktopSidebarWrapper({ children }) {
  return (
    <div className="flex flex-col md:flex-row justify-between w-full h-full">
      <div className="hidden md:block md:w-[158px] bg-white flex-none border-r-2 border-seam-black/[5%]"></div>
      <div className="flex justify-center items-center w-full h-full">
        <div className="flex flex-row justify-center w-full h-full">
          <div className="w-full max-w-[1124px] justify-center items-center">
            {children}
          </div>
        </div>
      </div>
      <div className="hidden md:block md:w-[158px] bg-white flex-none border-l-2 border-seam-black/[5%]"></div>
    </div>
  );
}