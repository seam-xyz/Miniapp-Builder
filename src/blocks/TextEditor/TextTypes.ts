import { ReactNode } from "react";
import { ContentState } from "draft-js";
import "draft-js";

declare module "draft-js" {
  export interface DraftDecoratorComponentProps {
    blockKey: any;
    children?: ReactNode;
    contentState: ContentState;
    decoratedText: string;
    dir?: any;
    end: number;
    entityKey?: string;
    offsetKey: string;
    start: number;
  }
}