import { Box, Button, Flex, Image, Text, useMantineTheme } from "@mantine/core";
import { IconTransfer } from "@tabler/icons-react";

export default function HeroSection() {
  const theme = useMantineTheme();
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="center"
      align={{ xs: "center", md: "stretch" }}
      gap={{ xs: 20, md: 40 }}
      w="100%"
    >
      <Flex
        direction="column"
        align={"center"}
        justify={"center"}
        gap={50}
        w={{ xs: "100%", md: "50%" }}
        style={{
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: theme.colors.orange[6],
          borderRadius: 5,
          padding: 40,
        }}
      >
        <Text
          className="select-none whitespace-nowrap"
          lh={"0.2"}
          ta={{ xs: "center", md: "center" }}
          w={"100%"}
          component="h1"
          size="xl"
          fw={900}
          fz={{ xs: "50", md: "50", lg: "70" }}
        >
          Be ready to <br />
          <Text
            component="span"
            size="xl"
            fw={900}
            fz={{ xs: "50", md: "50", lg: "70" }}
            variant="gradient"
            gradient={{
              from: theme.colors.yellow[9],
              to: theme.primaryColor,
              deg: 20,
            }}
          >
            Swapp
          </Text>
        </Text>
        <Flex
          align="center"
          style={{ gap: 10 }}
          mt={10}
          gap={40}
          // justify={{ xs: "center", md: "flex-start" }}
        >
          <Button
            h={{
              xs: "60",
              md: "100",
              lg: "150",
            }}
            component="a"
            href="/add/swap"
            w="150"
            variant="light"
            size="xl"
          >
            Have?
          </Button>
          <IconTransfer />

          <Button
            color="orange"
            component="a"
            href="/add/want"
            w="150"
            h={{
              xs: "60",
              md: "100",
              lg: "150",
            }}
            variant="light"
            size="xl"
          >
            Want?
          </Button>
        </Flex>
        <Text fw={300} opacity={0.5}>
          What are you waiting for?
        </Text>
      </Flex>
      <Box
        display={{ base: "none", md: "block" }}
        w={{ xs: "100%", md: "50%" }}
      >
        <Image
          style={{
            // scale to be equal to the other side
            transform: "scale(1.02)",
          }}
          fit="contain"
          src="/images/hero-image.png"
          alt="Hero image"
        />
      </Box>
    </Flex>
  );
}
