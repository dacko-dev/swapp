import { UseFormReturnType } from "@mantine/form";
import { TFormNewItem, TSerializedItemFormData } from "~/lib/types";
import FormHeader from "../FormHeader/FormHeader";
import ItemForm from "../ItemForm/ItemForm";

export const AddSwapFormStepOne = ({
  GRAPHQL_ENDPOINT,
  geoapifyApkiKey,
  form,
  itemFormData,
}: {
  GRAPHQL_ENDPOINT: string;
  form: UseFormReturnType<TFormNewItem>;
  itemFormData: TSerializedItemFormData;
  geoapifyApkiKey: string;
}) => {
  return (
    <>
      <FormHeader
        title="Add your swap"
        description="Tell us about your item and what you would like to swap it for."
      />
      <ItemForm
        GRAPHQL_ENDPOINT={GRAPHQL_ENDPOINT}
        geoapifyApkiKey={geoapifyApkiKey}
        itemFormData={itemFormData}
        form={form}
      />
    </>
  );
};
