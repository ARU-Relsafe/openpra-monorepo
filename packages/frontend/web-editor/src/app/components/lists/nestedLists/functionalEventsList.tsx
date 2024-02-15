import {
  DeleteFunctionalEvent,
  GetFunctionalEvents,
  PatchFunctionalEventLabel,
} from "shared-types/src/lib/api/NestedModelApiManager";
import { NestedModelList } from "./templateList/nestedModelList";

function FunctionalEventsList() {
  return (
    <NestedModelList
      getNestedEndpoint={GetFunctionalEvents}
      deleteNestedEndpoint={DeleteFunctionalEvent}
      patchNestedEndpoint={PatchFunctionalEventLabel}
      name="functional-event"
    />
  );
}

export { FunctionalEventsList };
