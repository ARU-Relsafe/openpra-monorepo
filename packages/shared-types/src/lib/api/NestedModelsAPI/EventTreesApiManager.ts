import { Delete, Get, EVENT_TREES_ENDPOINT, Patch, Post } from "../NestedModelApiManager";
import { NestedModelJSON, NestedModelType } from "../../types/modelTypes/innerModels/nestedModel";
import { LabelJSON } from "../../types/Label";

/**
 * Gets the list of the type of nested model
 * @param id - the parent model id, the parent whose list is to be retrieved
 * @returns a list of the nested models at  endpoint in a promise
 */
export async function GetEventTrees(id: string): Promise<NestedModelType[]> {
  try {
    const response = await Get(`${EVENT_TREES_ENDPOINT}/?id=${id}`);
    return (await response.json()) as Promise<NestedModelType[]>;
  } catch (error) {
    console.error("Failed to fetch event trees:", error);
    throw error;
  }
}

/**
 * Posts the type of nested model, and adds its id to its parent
 * @param data - a nestedModelJSON containing a label and a parent id
 * @param typedModel - the typed model to be updated
 * @returns a promise with the nested model, containing only those features
 */
// TODO:: === work on changing this to Partial<NestedModelJSON> ===
export async function PostEventTree(data: NestedModelJSON, typedModel: string): Promise<NestedModelType> {
  try {
    const response = await Post(`${EVENT_TREES_ENDPOINT}/`, data, typedModel);
    return (await response.json()) as Promise<NestedModelType>;
  } catch (error) {
    console.error("Failed to post event tree:", error);
    throw error;
  }
}

/**
 * updates the label for the type of nested model
 * @param id - the id of the nested model
 * @param data - a labelJSON with a name and optional description
 * @returns a promise with the new updated model, with its label
 */
export async function PatchEventTreeLabel(id: string, data: LabelJSON): Promise<NestedModelType> {
  try {
    const response = await Patch(`${EVENT_TREES_ENDPOINT}/${id}`, data);
    return (await response.json()) as Promise<NestedModelType>;
  } catch (error) {
    console.error("Failed to patch event tree:", error);
    throw error;
  }
}

/**
 * Deletes a nested model from the typed model and database
 * @param id - the id of the model to be Deleted
 * @param type - the typed model that this nested model belongs to
 * @returns the Deleted model
 */
export async function DeleteEventTree(id: string, type: string): Promise<void> {
  try {
    await Delete(`${EVENT_TREES_ENDPOINT}/?id=${id}&type=${type}`);
  } catch (error) {
    console.error("Failed to delete event tree:", error);
    throw error;
  }
}
