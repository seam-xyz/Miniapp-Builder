import { IonHeader } from "@ionic/react";

export default function SeamHeaderBar({
  leftComponent,
  rightComponent,
  centerComponent,
  leftAction,
  rightAction,
}) {
  const emptyComponentStyle = leftComponent
    ? "flex justify-center items-center gap-2 py-2 px-2 text-white rounded-full bg-[#efefef]"
    : "bg-transparent fill-transparent opacity-0";

  return (
    <IonHeader className="ion-no-border">
      <div className="flex items-center justify-between bg-transparent mt-4">
        <div
          onClick={() => {
            leftAction();
          }}
          className={`${emptyComponentStyle}`}
        >
          {leftComponent}
        </div>
        <div className="absolute left-[50%] translate-x-[-50%] cursor-pointer">
          {centerComponent}
        </div>
        <div
          onClick={() => {
            rightAction();
          }}
          className="flex justify-center items-center gap-2 py-2 px-2 text-white rounded-full bg-[#efefef]"
        >
          {rightComponent}
        </div>
      </div>
    </IonHeader>
  );
}
