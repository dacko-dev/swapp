import HomeCarousel from "~/components/ui/HomeCarousel/HomeCarousel";

import classes from "./HomePage.module.css";
import HomeItemSection from "~/components/pages/HomePage/HomeItemSection/HomeItemSection";
import { Button, Flex, Group, Text, useMantineTheme } from "@mantine/core";
import ItemCard from "~/components/ui/Cards/ItemCard/ItemCard";
import CardCollageCarousel from "~/components/ui/CardCollageCarousel/CardCollageCarousel";
import { mockItem } from "~/utils/mock";
import HeroSection from "~/components/pages/HomePage/HeroSection/HeroSection";

export default function HomePage() {
  const theme = useMantineTheme();

  return (
    <main className={classes.wrapper}>
      <HeroSection />
      <HomeItemSection header={"Top Picks"} subheader={"Our top picks for you"}>
        {Array.from({ length: 10 }).map((_, index) => (
          <ItemCard key={index} />
        ))}
      </HomeItemSection>

      <HomeCarousel />

      <CardCollageCarousel items={[mockItem, mockItem, mockItem, mockItem]} />

      <HomeItemSection
        header={"New Arrivals"}
        subheader={"Check out our new arrivals"}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <ItemCard aspect={"square"} key={index} />
        ))}
      </HomeItemSection>
      <Flex
        bg={"honey-orange"}
        className=" thin-banner flat-corners-sm"
        justify="space-between"
        align="center"
        p={{ base: "md", md: "lg" }}
      >
        <Group>
          <Text
            fz="lg"
            fw={"500"}
            lh="md"
            c={
              theme.autoContrast
                ? theme.colors[theme.primaryColor][9]
                : theme.black
            }
          >
            Subscribe to our newsletter and get the latest updates and unique
            offers
          </Text>
        </Group>
        <Button size="compact-lg">Subscribe</Button>
      </Flex>
    </main>
  );
}
