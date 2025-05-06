"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type AnimatedArrangedColListProps = {
  incommingChatsWithOrder: Array<{
    id: string;
    [key: string]: any;
  }>;
  renderChat: (chatId: string) => React.ReactNode;
};

type ChatDOMRectDetailsType = Array<{
  position: number;
  domRect: undefined | DOMRect;
  id: string;
}>;

export const AnimatedArrangedColList: React.FC<AnimatedArrangedColListProps> = (
  props
) => {
  const [orderedChatsOnUI, setOrderedChatsOnUI] = useState<
    Array<
      AnimatedArrangedColListProps["incommingChatsWithOrder"][number] & {
        position: number;
      }
    >
  >(() => {
    return props.incommingChatsWithOrder.map((chat, index) => {
      return { ...chat, position: index };
    });
  });

  useEffect(() => {
    if (props.incommingChatsWithOrder.length !== orderedChatsOnUI.length) {
      setOrderedChatsOnUI(
        props.incommingChatsWithOrder.map((chat, index) => {
          return { ...chat, position: index };
        })
      );
    } else {
      const mapping: Record<string, number> = {};
      props.incommingChatsWithOrder.forEach((chat, index) => {
        mapping[chat.id] = index;
      });
      setOrderedChatsOnUI((prevOrder) => {
        return prevOrder.map((chat) => {
          return { ...chat, position: mapping[chat.id] };
        });
      });
    }
  }, [props, props.incommingChatsWithOrder]);

  const [chatDOMRectDetails, setChatDOMRectDetails] =
    useState<ChatDOMRectDetailsType>(() => {
      return props.incommingChatsWithOrder.map((chat, index) => {
        return {
          position: index,
          domRect: undefined,
          id: chat.id,
        };
      });
    });

  return (
    <>
      {orderedChatsOnUI.map((chat) => {
        return (
          <Chat
            key={chat.id}
            id={chat.id}
            position={chat.position}
            renderChat={props.renderChat}
            setChatDOMRectDetails={setChatDOMRectDetails}
            chatDOMRectDetails={chatDOMRectDetails}
            orderedChatsOnUI={orderedChatsOnUI}
          />
        );
      })}
    </>
  );
};

const Chat: React.FC<{
  id: string;
  position: number;
  renderChat: (chatId: string) => React.ReactNode;
  setChatDOMRectDetails: Dispatch<SetStateAction<ChatDOMRectDetailsType>>;
  chatDOMRectDetails: ChatDOMRectDetailsType;
  orderedChatsOnUI: ({
    [key: string]: any;
    id: string;
  } & {
    position: number;
  })[];
}> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState<string | undefined>(undefined);
  const [isHeightCalculated, setIsHeightCalculated] = useState(false);

  const calculateHeight = () => {
    if (ref.current && !isHeightCalculated) {
      props.setChatDOMRectDetails((prev) => {
        const newData = [...prev];
        newData[props.position] = {
          ...newData[props.position],
          domRect: ref.current?.getBoundingClientRect(),
        };
        return newData;
      });
    }
  };

  useEffect(() => {
    calculateHeight();
  }, [props]);

  const findTop = () => {
    let hasTop = true;
    let top = 0;
    for (let i = 0; i < props.position; i++) {
      const domRect = props.chatDOMRectDetails?.[i]?.domRect;
      if (domRect?.height != undefined) {
        top += domRect.height;
      } else {
        hasTop = false;
        break;
      }
    }
    if (hasTop) {
      setTop(top + "px");
      setIsHeightCalculated(true);
    }
  };

  useEffect(() => {
    findTop();
  }, [props.chatDOMRectDetails]);

  useEffect(() => {
    setIsHeightCalculated(false);
  }, [props.orderedChatsOnUI]);

  const zIndex = 100 - props.position;
  return (
    <div
      ref={ref}
      style={{
        top: top,
        zIndex: zIndex,
        position: "absolute",
        width: "100%",
        transitionProperty: "all",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 1, 1)",
        transitionDuration: "200ms",
        backgroundColor: "white",
      }}
    >
      {props.renderChat(props.id)}
    </div>
  );
};
