import { forwardRef, memo, useCallback, useEffect, useRef, useState } from "react";
import { BlockModel, ComposerComponentProps, FeedComponentProps } from "./types";
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import WandIcon from "@mui/icons-material/AutoFixHigh";
import SendIcon from "@mui/icons-material/Send";

import plainsIcon from "../blocks/assets/MagicCard/icons/plains.png";
import islandIcon from "../blocks/assets/MagicCard/icons/island.png";
import swampIcon from "../blocks/assets/MagicCard/icons/swamp.png";
import mountainIcon from "../blocks/assets/MagicCard/icons/mountain.png";
import forestIcon from "../blocks/assets/MagicCard/icons/forest.png";
import tapIcon from "../blocks/assets/MagicCard/icons/tap.png";
import untapIcon from "../blocks/assets/MagicCard/icons/untap.png";
import icon1 from "../blocks/assets/MagicCard/icons/1.png";
import icon2 from "../blocks/assets/MagicCard/icons/2.png";
import icon3 from "../blocks/assets/MagicCard/icons/3.png";
import icon4 from "../blocks/assets/MagicCard/icons/4.png";
import icon5 from "../blocks/assets/MagicCard/icons/5.png";
import icon6 from "../blocks/assets/MagicCard/icons/6.png";
import icon7 from "../blocks/assets/MagicCard/icons/7.png";
import icon8 from "../blocks/assets/MagicCard/icons/8.png";
import icon9 from "../blocks/assets/MagicCard/icons/9.png";
import iconX from "../blocks/assets/MagicCard/icons/x.png";

import blackBorder from "../blocks/assets/MagicCard/borders/black-border.png";
import whiteBorder from "../blocks/assets/MagicCard/borders/white-border.png";

import artifactFrame from "../blocks/assets/MagicCard/frames/artifact-frame.png";
import whiteFrame from "../blocks/assets/MagicCard/frames/white-frame.png";
import blackFrame from "../blocks/assets/MagicCard/frames/black-frame.png";
import blueFrame from "../blocks/assets/MagicCard/frames/blue-frame.png";
import greenFrame from "../blocks/assets/MagicCard/frames/green-frame.png";
import redFrame from "../blocks/assets/MagicCard/frames/red-frame.png";

import artifactPtBox from "../blocks/assets/MagicCard/ptBoxes/artifact-pt-box.png";
import whitePtBox from "../blocks/assets/MagicCard/ptBoxes/white-pt-box.png";
import blackPtBox from "../blocks/assets/MagicCard/ptBoxes/black-pt-box.png";
import bluePtBox from "../blocks/assets/MagicCard/ptBoxes/blue-pt-box.png";
import greenPtBox from "../blocks/assets/MagicCard/ptBoxes/green-pt-box.png";
import redPtBox from "../blocks/assets/MagicCard/ptBoxes/red-pt-box.png";

import "../blocks/assets/MagicCard/magicCard.css";

type CardColor = "artifact" | "white" | "blue" | "black" | "red" | "green";
type BorderColor = "black" | "white";

type MagicCardProps = {
  cardName: string;
  manaCost: { colorless: number; white: number; blue: number; black: number; red: number; green: number };
  cardColor: CardColor;
  borderColor: BorderColor;
  illustration: string;
  type: string;
  subType: string;
  power: string;
  toughness: string;
  rules: string;
  flavorText: string;
};

type MagicCardSetterProps = {
  setCardName: (cardName: string) => void;
  setManaCost: (manaCost: {
    colorless: number;
    white: number;
    blue: number;
    black: number;
    red: number;
    green: number;
  }) => void;
  setCardColor: (color: CardColor) => void;
  setBorderColor: (borderColor: BorderColor) => void;
  setIllustration: (illustration: string) => void;
  setType: (type: string) => void;
  setSubType: (subType: string) => void;
  setPower: (power: string) => void;
  setToughness: (toughness: string) => void;
  setRules: React.Dispatch<React.SetStateAction<string>>;
  setFlavorText: (flavorText: string) => void;
};

type Resources = {
  borders: {
    black: string;
    white: string;
  };
  icons: Record<string, string>;
  frames: Record<CardColor, string>;
  ptBoxes: Record<CardColor, string>;
};

const resources: Resources = {
  borders: {
    black: blackBorder,
    white: whiteBorder,
  },
  icons: {
    "{p}": plainsIcon,
    "{i}": islandIcon,
    "{s}": swampIcon,
    "{m}": mountainIcon,
    "{f}": forestIcon,
    "{t}": tapIcon,
    "{u}": untapIcon,
    "{1}": icon1,
    "{2}": icon2,
    "{3}": icon3,
    "{4}": icon4,
    "{5}": icon5,
    "{6}": icon6,
    "{7}": icon7,
    "{8}": icon8,
    "{9}": icon9,
    "{x}": iconX,
  },
  frames: {
    artifact: artifactFrame,
    white: whiteFrame,
    black: blackFrame,
    blue: blueFrame,
    green: greenFrame,
    red: redFrame,
  },
  ptBoxes: {
    artifact: artifactPtBox,
    white: whitePtBox,
    black: blackPtBox,
    blue: bluePtBox,
    green: greenPtBox,
    red: redPtBox,
  },
} as const;

// /{p}|{w}|{1}|{2}|.../g
const placeholderRegex = new RegExp(
  Object.keys(resources.icons)
    .map((placeholder) => placeholder.replace(/([{}])/g, "\\$1"))
    .join("|"),
  "g"
);

function mergeRefs<T = any>(
  refs: Array<React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export const MagicCardFeedComponent = ({ model }: FeedComponentProps) => {
  return (
    <img
      style={{ width: "60%", height: "auto", objectFit: "contain", marginLeft: "auto", marginRight: "auto" }}
      src={model.data["dataURL"]}
      alt="Magic Card"
    />
  );
};

const RulesHelper = memo(({ addIcon }: { addIcon: (icon: string) => void }) => {
  const imgStyle = { cursor: "pointer", width: 20, height: 20 };

  const makeAddIcon = (icon: string) => (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    addIcon(icon);
  };

  // prevent mousedown from taking away focus
  const handleMouseDown = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.preventDefault();
  };

  return (
    <>
      {Object.keys(resources.icons).map((iconPlaceholder) => (
        <ButtonBase key={iconPlaceholder}>
          <img
            style={imgStyle}
            src={resources.icons[iconPlaceholder]}
            alt={iconPlaceholder}
            onMouseDown={handleMouseDown}
            onClick={makeAddIcon(iconPlaceholder)}
          />
        </ButtonBase>
      ))}
    </>
  );
});

const MagicCardEditor = (props: MagicCardProps & MagicCardSetterProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rulesInputRef = useRef<HTMLInputElement>(null);

  const { setRules } = props;

  const addToRules = useCallback(
    (icon: string) => {
      setRules((state) => {
        if (rulesInputRef.current == null) {
          return state + icon;
        }

        if (rulesInputRef.current.selectionEnd == null) {
          return state + icon;
        }

        const newSelection = rulesInputRef.current.selectionStart ?? 0;

        setTimeout(() => {
          if (rulesInputRef.current == null) {
            return;
          }
          rulesInputRef.current.setSelectionRange(newSelection + 3, newSelection + 3, "forward");
        }, 1);

        return (
          state.slice(0, rulesInputRef.current.selectionStart ?? 0) +
          icon +
          state.slice(rulesInputRef.current.selectionEnd)
        );
      });
      rulesInputRef.current?.focus();
    },
    [setRules]
  );

  return (
    <Box
      style={{
        overflowY: "auto",
        height: "calc(100vh - 86px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack style={{ justifyContent: "center", height: "100%", paddingTop: 72, paddingBottom: 8 }} spacing={2}>
        <Stack gap={2} direction={"row"} flexWrap="wrap">
          <TextField
            required
            style={{ flexGrow: 1 }}
            label="Card Name"
            placeholder="Name"
            value={props.cardName}
            onChange={(e) => props.setCardName(e.target.value)}
          />
          <FormControl style={{ flexGrow: 1 }}>
            <InputLabel id="magic-color-label">Color</InputLabel>
            <Select
              native
              labelId="magic-color-label"
              id="magic-color-select"
              label="Color"
              value={props.cardColor}
              onChange={(e) => props.setCardColor(e.target.value as CardColor)}
            >
              <option value="artifact">Artifact</option>
              <option value="white">White</option>
              <option value="blue">Blue</option>
              <option value="black">Black</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
            </Select>
          </FormControl>
          <FormControl style={{ flexGrow: 1 }}>
            <InputLabel id="magic-border-label">Border</InputLabel>
            <Select
              native
              labelId="magic-border-label"
              id="magic-border-select"
              label="Border"
              value={props.borderColor}
              onChange={(e) => props.setBorderColor(e.target.value as BorderColor)}
            >
              <option value="white">White</option>
              <option value="black">Black</option>
            </Select>
          </FormControl>
        </Stack>
        <Stack gap={1} direction={"row"} flexWrap="wrap">
          <TextField
            InputProps={{
              inputProps: {
                min: 0,
                max: 9,
              },
            }}
            size="small"
            label="Colorless"
            type="number"
            value={props.manaCost.colorless}
            onChange={(e) => props.setManaCost({ ...props.manaCost, colorless: Number(e.target.value) })}
          />
          {["white", "blue", "black", "red", "green"].map((color) => (
            <TextField
              key={color}
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 5,
                },
              }}
              size="small"
              label={color}
              type="number"
              value={props.manaCost[color as keyof typeof props.manaCost]}
              onChange={(e) => props.setManaCost({ ...props.manaCost, [color]: Number(e.target.value) })}
            />
          ))}
        </Stack>
        <ButtonBase
          onClick={() => {
            props.setIllustration("");
            fileInputRef.current?.click();
          }}
        >
          <TextField
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            label="Illustration"
            placeholder="Upload an image"
            style={{
              pointerEvents: "none",
            }}
            value={props.illustration}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const { files } = event.target;
              if (files && files.length > 0) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const dataURL = e.target?.result;
                  if (typeof dataURL === "string") {
                    props.setIllustration(dataURL);
                  }
                };
                reader.readAsDataURL(files[0]);
              } else {
                props.setIllustration("");
              }
            }}
          />
        </ButtonBase>
        <Stack spacing={2} direction={"row"}>
          <TextField
            required
            style={{ flexGrow: 1 }}
            label="Type"
            placeholder="Creature"
            value={props.type}
            onChange={(e) => props.setType(e.target.value)}
          />
          <TextField
            style={{ flexGrow: 1 }}
            label="Subtype"
            placeholder="Dragon"
            value={props.subType}
            onChange={(e) => props.setSubType(e.target.value)}
          />
        </Stack>
        <TextField
          fullWidth
          inputRef={rulesInputRef}
          label="Rules"
          multiline
          minRows={2}
          value={props.rules}
          onChange={(e) => props.setRules(e.target.value)}
          FormHelperTextProps={{
            classes: {
              root: "flex flex-row flex-wrap gap-1",
            },
            component: "div",
          }}
          helperText={<RulesHelper addIcon={addToRules} />}
        />
        <TextField
          fullWidth
          label="Flavor Text"
          value={props.flavorText}
          onChange={(e) => props.setFlavorText(e.target.value)}
        />
        <Stack spacing={2} direction={"row"}>
          <TextField
            style={{ flexGrow: 1 }}
            label="Power"
            // type="number"
            value={props.power}
            onChange={(e) => props.setPower(e.target.value)}
          />
          <TextField
            style={{ flexGrow: 1 }}
            label="Toughness"
            // type="number"
            value={props.toughness}
            onChange={(e) => props.setToughness(e.target.value)}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

// Function to wrap text into lines in a canvas
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, font: string) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";
  const saveFont = ctx.font;
  ctx.font = font;

  for (const word of words) {
    const line = currentLine + word + " ";
    const width = ctx.measureText(line).width;

    if (width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = word + " ";
    } else {
      currentLine = line;
    }
  }

  lines.push(currentLine); // Add the last line
  ctx.font = saveFont;
  return lines;
}

const MagicCard = forwardRef((props: MagicCardProps, ref: React.ForwardedRef<HTMLCanvasElement>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [borderImg, setBorderImg] = useState<HTMLImageElement | null>(null);
  const [frameImg, setFrameImg] = useState<HTMLImageElement | null>(null);
  const [ptBoxImg, setPtBoxImg] = useState<HTMLImageElement | null>(null);
  const [illustrationImg, setIllustrationImg] = useState<HTMLImageElement | null>(null);
  const [placeholderImages, setPlaceholderImages] = useState<Record<
    keyof typeof resources.icons,
    HTMLImageElement
  > | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  const mergedRef = mergeRefs<HTMLCanvasElement>([canvasRef, ref]);

  // load resources
  useEffect(() => {
    const illustration = new Image();
    illustration.src = props.illustration;
    illustration.onload = () => setIllustrationImg(illustration);

    const border = new Image();
    border.src = resources.borders[props.borderColor];
    border.onload = () => setBorderImg(border);

    const frame = new Image();
    frame.src = resources.frames[props.cardColor];
    frame.onload = () => setFrameImg(frame);

    const ptBox = new Image();
    ptBox.src = resources.ptBoxes[props.cardColor];
    ptBox.onload = () => setPtBoxImg(ptBox);

    document.fonts.load("bold 48px MagicCard").then(() => {
      setFontLoaded(true);
    });

    // load icons
    const images: Record<string, HTMLImageElement> = {};
    const imagePromises = Object.keys(resources.icons).map((iconPlaceholder) => {
      return new Promise<void>((resolve) => {
        const iconUrl = resources.icons[iconPlaceholder];
        const img = new Image();
        img.src = iconUrl;
        img.onload = () => {
          images[iconPlaceholder] = img;
          resolve();
        };
      });
    });
    Promise.all(imagePromises).then(() => {
      setPlaceholderImages(images);
    });
  }, [props.borderColor, props.cardColor, props.illustration]);

  const loading =
    placeholderImages == null ||
    illustrationImg == null ||
    borderImg == null ||
    frameImg == null ||
    ptBoxImg == null ||
    canvasRef.current == null ||
    !fontLoaded;

  // draw card
  useEffect(() => {
    if (loading) {
      return;
    }

    const ctx = canvasRef.current.getContext("2d");
    if (ctx == null) {
      return;
    }

    ctx.fillStyle = "black";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    ctx.drawImage(illustrationImg, 63, 122, 618, 455);
    ctx.drawImage(borderImg, 0, 0);
    ctx.drawImage(frameImg, 40, 40);

    ctx.font = "bold 48px MagicCard";
    ctx.fillText(props.cardName, 68, 62, 610);

    ctx.font = "bold 40px MagicCard";
    const textWidth = ctx.measureText(props.type).width;
    ctx.fillText(props.type, 68, 592, 610);

    // draw mana cost
    const manaCostPlaceholders: Array<keyof typeof resources.icons> = [];
    if (props.manaCost.colorless > 0 && props.manaCost.colorless < 10) {
      manaCostPlaceholders.push(`{${props.manaCost.colorless}}`);
    }
    if (props.manaCost["white"] > 0) {
      manaCostPlaceholders.push(`{p}`.repeat(props.manaCost["white"]));
    }
    if (props.manaCost["blue"] > 0) {
      manaCostPlaceholders.push(`{i}`.repeat(props.manaCost["blue"]));
    }
    if (props.manaCost["black"] > 0) {
      manaCostPlaceholders.push(`{s}`.repeat(props.manaCost["black"]));
    }
    if (props.manaCost["red"] > 0) {
      manaCostPlaceholders.push(`{m}`.repeat(props.manaCost["red"]));
    }
    if (props.manaCost["green"] > 0) {
      manaCostPlaceholders.push(`{f}`.repeat(props.manaCost["green"]));
    }

    let x = 681;
    const manaImageSize = 30;
    placeholderRegex.lastIndex = 0;
    for (const [icon] of Array.from(manaCostPlaceholders.reverse().join("").matchAll(placeholderRegex))) {
      // console.log(manaCostPlaceholder);
      ctx.drawImage(placeholderImages[icon], x - manaImageSize, 70, manaImageSize, manaImageSize);
      x -= manaImageSize + 1.5;
    }

    ctx.font = "bold 40px MagicCard";

    // draw subtype
    if (props.subType !== "") {
      // line separating type and subtype
      const spacing = 8;
      const barWidth = 25;
      ctx.fillRect(68 + textWidth + spacing, 614, barWidth, 2);
      // draw subtype
      ctx.fillText(
        props.subType,
        68 + textWidth + spacing * 2 + barWidth,
        592,
        610 - textWidth - spacing * 2 - barWidth
      );
    }

    // draw power and toughness
    if (props.power !== "" && props.toughness !== "") {
      // draw the pt box
      ctx.drawImage(ptBoxImg, 538, 911);

      ctx.font = "bold 40px MagicCard";
      ctx.textAlign = "center";
      const ptText = `${props.power}/${props.toughness}`;
      ctx.fillText(ptText, 542 + ptBoxImg.width / 2, 930, ptBoxImg.width - 50);
      ctx.textAlign = "left";
    }

    // draw rules and flavor text
    // the rules are centered vertically in the box
    const lineHeight = 35;
    const startX = 68; // starting x
    let y = 654; // starting y
    const maxWidth = 610;
    const maxHeight = 940; // 666 + 295
    const rulesLines = [];
    const flavorTextLines = wrapText(ctx, props.flavorText, maxWidth, "italic 30px MagicCard");

    const paragraphs = props.rules.split("\n");
    for (const paragraph of paragraphs) {
      rulesLines.push(...wrapText(ctx, paragraph, maxWidth, "normal 30px MagicCard"));
    }

    // get an estimate of the total height
    const totalHeight = (rulesLines.length + flavorTextLines.length + 1) * lineHeight; // +1 for the space between rules and flavor text

    // center vertically -> set the new starting y
    y = y + (maxHeight - totalHeight - y) / 2;

    // fill rules
    ctx.font = "normal 30px MagicCard";
    const spaceWidth = ctx.measureText(" ").width;
    for (let line of rulesLines) {
      let x = startX;
      const words = line.split(" ");
      for (const word of words) {
        placeholderRegex.lastIndex = 0;
        if (placeholderRegex.test(word)) {
          placeholderRegex.lastIndex = 0;
          const matches = Array.from(word.matchAll(placeholderRegex));

          let lastPartIndex = 0;
          for (const match of matches) {
            const icon = match[0];
            const index = match.index;

            if (index === undefined) {
              continue;
            }

            const part = word.slice(lastPartIndex, index);
            const partLength = ctx.measureText(part).width;
            ctx.fillText(part, x, y);
            x += partLength;
            lastPartIndex = index + 3; // {x} -> 3 characters

            ctx.drawImage(placeholderImages[icon], x, y + 2, 25, 25);
            x += 25; // icon width
          }

          if (lastPartIndex < word.length) {
            const part = word.slice(lastPartIndex);
            const partLength = ctx.measureText(part).width;
            ctx.fillText(part, x, y);
            x += partLength;
          }
          x += spaceWidth;
        } else {
          ctx.fillText(word, x, y);
          x += ctx.measureText(word).width + spaceWidth;
        }
      }

      y += lineHeight;
    }

    // add a line between the rules and flavor text
    y += lineHeight;

    // fill flavor text
    ctx.font = "italic 30px MagicCard";
    for (const line of flavorTextLines) {
      ctx.fillText(line, startX, y, maxWidth);
      y += lineHeight;
    }
  }, [
    borderImg,
    frameImg,
    illustrationImg,
    loading,
    props.rules,
    props.cardName,
    props.subType,
    props.type,
    ptBoxImg,
    props.flavorText,
    placeholderImages,
    props.power,
    props.toughness,
    props.manaCost,
  ]);

  return (
    <Stack justifyContent="center" alignItems="center" padding={2} style={{ width: "auto", height: "100vh" }}>
      <canvas ref={mergedRef} style={{ height: "100%" }} width={744} height={1039} />
      <div
        style={{
          display: loading ? "block" : "none",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircularProgress size={48} />
      </div>
    </Stack>
  );
});

export const MagicCardComposerComponent = ({ model, done }: ComposerComponentProps) => {
  const [cardName, setCardName] = useState("");
  const [manaCost, setManaCost] = useState<MagicCardProps["manaCost"]>({
    colorless: 0,
    white: 0,
    blue: 0,
    black: 0,
    red: 0,
    green: 0,
  });
  const [cardColor, setCardColor] = useState<CardColor>("artifact");
  const [borderColor, setBorderColor] = useState<BorderColor>("black");
  const [illustration, setIllustration] = useState("");
  const [type, setType] = useState(""); // creature
  const [subType, setSubType] = useState(""); // human warrior
  const [power, setPower] = useState<MagicCardProps["power"]>("");
  const [toughness, setToughness] = useState<MagicCardProps["toughness"]>("");
  const [rules, setRules] = useState<string>("");
  const [flavorText, setFlavorText] = useState("");
  const [editing, setEditing] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const preview = useCallback(() => {
    if (canvasRef.current == null) {
      return;
    }
    const dataURL = canvasRef.current.toDataURL("image/png");
    // TODO file upload
    model.data["dataURL"] = dataURL;
    done(model);
  }, [done, model]);

  return (
    <Stack style={{ display: "flex", height: "100vh" }}>
      {editing ? (
        <MagicCardEditor
          cardName={cardName}
          manaCost={manaCost}
          cardColor={cardColor}
          borderColor={borderColor}
          illustration={illustration}
          type={type}
          subType={subType}
          power={power}
          toughness={toughness}
          rules={rules}
          flavorText={flavorText}
          setCardName={setCardName}
          setManaCost={setManaCost}
          setCardColor={setCardColor}
          setBorderColor={setBorderColor}
          setIllustration={setIllustration}
          setType={setType}
          setSubType={setSubType}
          setPower={setPower}
          setToughness={setToughness}
          setRules={setRules}
          setFlavorText={setFlavorText}
        />
      ) : (
        <MagicCard
          ref={canvasRef}
          cardName={cardName}
          manaCost={manaCost}
          cardColor={cardColor}
          borderColor={borderColor}
          illustration={illustration}
          type={type}
          subType={subType}
          power={power}
          toughness={toughness}
          rules={rules}
          flavorText={flavorText}
        />
      )}

      <Stack
        bottom={0}
        width={"100%"}
        position="absolute"
        padding={3}
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {editing ? (
          <Button variant="contained" startIcon={<WandIcon />} onClick={() => setEditing(false)}>
            View Card
          </Button>
        ) : (
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
            Edit Card
          </Button>
        )}
        <Button disabled={editing} variant="contained" endIcon={<SendIcon />} onClick={preview}>
          Preview Post
        </Button>
      </Stack>
    </Stack>
  );
};
