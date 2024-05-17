import { EuiPageTemplate, EuiSkeletonRectangle, EuiSpacer } from "@elastic/eui";
import { ReactElement, useEffect, useState } from "react";
import { InternalEventsModelType } from "shared-types/src/lib/types/modelTypes/largeModels/internalEventsModel";
import { CreateGenericList } from "../GenericList";
import { UseGlobalStore } from "../../../zustand/Store";
import { GenericItemList } from "../GenericItemList";

function InternalEventsList(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [genericListItems, setGenericListItems] = useState<ReactElement[]>([]);

  const internalEventsList = UseGlobalStore.use.internalEvents();
  const setInternalEvents = UseGlobalStore.use.setInternalEvents();
  const createInternalEvents = UseGlobalStore.use.addInternalEvent();
  const deleteInternalEvent = UseGlobalStore.use.deleteInternalEvent();
  const editInternalEvent = UseGlobalStore.use.editInternalEvent();

  useEffect(() => {
    setIsLoading(true);
    void setInternalEvents().then(() => {
      setIsLoading(false);
    });
  }, [setInternalEvents]);

  useEffect(() => {
    setGenericListItems(
      CreateGenericList<InternalEventsModelType>({
        modelList: internalEventsList,
        endpoint: "Internal Events",
        postTypedEndpoint: createInternalEvents,
        patchTypedEndpoint: editInternalEvent,
        deleteTypedEndpoint: deleteInternalEvent,
      }),
    );
  }, [createInternalEvents, deleteInternalEvent, editInternalEvent, internalEventsList]);

  return (
    <EuiPageTemplate
      panelled={false}
      offset={48}
      grow={true}
      restrictWidth={true}
    >
      <EuiPageTemplate.Section>
        <EuiSkeletonRectangle
          width="100%"
          height={490}
          isLoading={isLoading}
          contentAriaLabel="Example description"
        >
          <GenericItemList>{genericListItems}</GenericItemList>
        </EuiSkeletonRectangle>
        <EuiSpacer size="s" />
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}

export { InternalEventsList };
