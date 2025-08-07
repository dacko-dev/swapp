import { Box, Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import CheckboxButton from "../../components/ui/Buttons/CheckboxButton/CheckboxButton";
import {
  checkIfSwapType,
  loadFromSessionStorage,
  saveToSessionStorage,
} from "~/lib/utils";
import FormHeader from "~/components/forms/FormHeader/FormHeader";
import { TSwapType } from "~/lib/types";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export const loader = async ({
  context,
  params,
  request,
}: LoaderFunctionArgs) => {
  const { sessionId, userId } = await getAuth({ request, params, context });
  if (!sessionId || !userId) {
    return redirect("/login");
  }
};

export default function AddPage() {
  // const { swapType } = useLoaderData<typeof loader>();
  const [selectedSwapType, setSelectedSwapType] = useState<
    TSwapType | undefined
  >(undefined);
  const [loadingSessionStorage, setLoadingSessionStorage] = useState(true);

  const handleSwapTypeChange = (swapType: TSwapType) => {
    saveToSessionStorage("addSwapType", swapType);
    setSelectedSwapType(swapType);
  };

  useEffect(() => {
    const storageSwapType = checkIfSwapType(
      loadFromSessionStorage("addSwapType")
    );
    console.log("storageSwapType", storageSwapType);
    if (storageSwapType) {
      setSelectedSwapType(storageSwapType);
    }
    setLoadingSessionStorage(false);
  }, []);

  return (
    <Box>
      <FormHeader
        title="Add a Swap"
        description="A new swap will be created and added to the list of swaps."
      />

      <Flex
        direction={"column"}
        justify={"space-between"}
        align={"center"}
        mt={"xl"}
        gap={"sm"}
      >
        <CheckboxButton
          disabled={loadingSessionStorage}
          label="I want to swap"
          checked={selectedSwapType === "swap"}
          setChecked={setSelectedSwapType}
          onClick={() => {
            handleSwapTypeChange("swap");
            console.log("swap");
          }}
          value="swap"
        />
        <CheckboxButton
          disabled={loadingSessionStorage}
          label="I want to give"
          checked={selectedSwapType === "passOn"}
          setChecked={setSelectedSwapType}
          onClick={() => handleSwapTypeChange("passOn")}
          value="passOn"
        />
        <CheckboxButton
          disabled={loadingSessionStorage}
          label="I am looking for"
          checked={selectedSwapType === "seeking"}
          setChecked={setSelectedSwapType}
          onClick={() => handleSwapTypeChange("seeking")}
          value="seeking"
        />
      </Flex>
    </Box>
  );
}
