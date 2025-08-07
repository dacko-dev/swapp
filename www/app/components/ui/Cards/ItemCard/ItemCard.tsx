import { Image, Group, Badge, Box, AspectRatio, Text } from "@mantine/core";
import classes from "./ItemCard.module.css";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { mockItem } from "~/utils/mock";

type TCardAspectRatio = "mini" | "square" | "wide";

const aspectRatios: Record<
  TCardAspectRatio,
  { container: number; image: number }
> = {
  mini: {
    container: 5.3 / 8.6,
    image: 4.2 / 6.2,
  },
  square: {
    container: 7.2 / 8.6,
    image: 1,
  },
  wide: {
    container: 10.8 / 8.6,
    image: 6.2 / 9.9,
  },
};

function ItemCard({
  aspect = "square",
}: {
  aspect?: TCardAspectRatio | number | undefined;
}) {
  const { image, title, description, country } = mockItem;

  const containerRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const options = useMemo(() => {
    if (typeof window === "undefined") {
      return {}; // Return an empty object when rendering on the server
    }

    return {
      root: null,
      rootMargin: "0px",
      // rootMargin: `${convertRemToPixels(
      //   getComputedStyle(document.documentElement).getPropertyValue(
      //     "--header-h"
      //   )
      // )}px 0px ${convertRemToPixels(
      //   getComputedStyle(document.documentElement).getPropertyValue(
      //     "--footer-h"
      //   )
      // )}px 0px`,
      threshold: 0.1,
    };
  }, []);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const img = imageRef.current;
      if (entry.isIntersecting && img) {
        img.classList.add(classes["developed"]);
        console.log("Image is visible: ", classes["developed"]);
      }
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, options);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [observerCallback, options]);

  return (
    <AspectRatio
      ratio={
        typeof aspect === "string" ? aspectRatios[aspect].container : aspect
      }
      maw={450}
      mx="auto"
    >
      <Box ref={containerRef} component="a" href="#" className={classes.card}>
        <Box className={classes["top-tape"]}>
          <Image src={"/images/tape.png"} height={50} />
        </Box>
        <Box className="relative ">
          <Box className="overflow-hidden relative ">
            <AspectRatio
              ratio={
                typeof aspect === "string" ? aspectRatios[aspect].image : aspect
              }
              maw={450}
              mx="auto"
            >
              <Box
                w="100%"
                h="100%"
                bg={"var(--mantine-color-gray-2)"}
                className="absolute"
                top={0}
                left={0}
              />
              <Image
                ref={imageRef}
                className={classes.image}
                src={image}
                alt={title}
                height={200}
              />
            </AspectRatio>
          </Box>
          <Text className={classes["signature"]}>Reenie Beanie</Text>
        </Box>
        <Box className={classes.section}>
          <Group justify="apart">
            <h4 className={classes["item-name"]}>{title}</h4>
            <Badge size="sm" variant="dark">
              {country}
            </Badge>
          </Group>
          <Text lineClamp={2} className={classes["item-description"]}>
            {description}
          </Text>
        </Box>
      </Box>
    </AspectRatio>
  );
}

export default React.memo(ItemCard);
