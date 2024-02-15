import { logicalStyle } from "@elastic/eui";
import { EuiButtonIconPropsForButton } from "@elastic/eui/src/components/button/button_icon/button_icon";
import { PatchInternalEvent } from "shared-types/src/lib/api/TypedModelApiManager";
import {
  ButtonWithClosablePopover,
  ButtonWithPopover,
  ButtonWithPopoverProps,
} from "../buttons/ButtonWithPopover";
import { toTitleCase } from "../../../utils/StringUtils";
import {
  TypedModelActionForm,
  ItemFormProps,
} from "../forms/typedModelActionForm";
import { GenericListItemProps } from "../lists/GenericListItem";
import { ListItemContextMenu } from "./ListItemContextMenu";

export type ListItemActionProps = {} & ButtonWithPopoverProps &
  Omit<EuiButtonIconPropsForButton, "iconType"> &
  ItemFormProps;

export function ListItemContextMenuButton(props: GenericListItemProps) {
  return (
    <ButtonWithPopover
      iconType="boxesHorizontal"
      isIcon={true}
      aria-label="Edit Item"
      confirmDiscard={false}
      popoverProps={{
        initialFocus: "#name",
        panelPaddingSize: "s",
      }}
      color="text"
    >
      <ListItemContextMenu {...props} />
    </ButtonWithPopover>
  );
}

function ListItemAction() {}

//TODO
export { ListItemAction };
export function ListItemEditAction({
  itemName,
  patchEndpoint,
  ...rest
}: ListItemActionProps) {
  const label = toTitleCase(itemName);

  const scaffolding = (child: JSX.Element) => (
    <div style={logicalStyle("max-width", 260)}>{child}</div>
  );

  return (
    <ButtonWithClosablePopover
      closeProp="onCancel"
      popoverExtra={scaffolding}
      iconType="documentEdit"
      isIcon={true}
      aria-label="Edit Item"
      confirmDiscard={true}
      popoverProps={{
        initialFocus: "#name",
      }}
      color="text"
    >
      <TypedModelActionForm
        compressed
        noHeader
        action="edit"
        itemName={label}
        patchEndpoint={PatchInternalEvent}
      />
    </ButtonWithClosablePopover>
  );
}
