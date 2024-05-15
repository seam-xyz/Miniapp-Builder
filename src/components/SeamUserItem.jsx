import { Avatar } from "@mui/material";

const SeamUserItem = ({ subtitle }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-between justify-center flex-grow w-full">
        <Avatar src={""} className="w-10 h-10" />
        <div className="flex flex-col ml-4 flex-grow min-w-0">
          <div
            className="text-sm font-semibold hover:underline"
            style={{ maxWidth: "100%" }}
          >
            {"Frankie the Tester"}
          </div>
          <div className="text-gray-500 text-xs normal-case font-normal leading-normal cursor-pointer select-none hover:underline">
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeamUserItem;