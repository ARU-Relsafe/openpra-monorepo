import { Controller, Post, Body, Get, Query, Delete, Param, Patch } from '@nestjs/common';
import { TypedModelService } from './typedModel.service';
import InternalEventsModel from '../../../shared-types/src/lib/types/modelTypes/largeModels/internalEventsModel';
import InternalHazardsModel from '../../../shared-types/src/lib/types/modelTypes/largeModels/internalHazardsModel';
import ExternalHazardsModel from '../../../shared-types/src/lib/types/modelTypes/largeModels/externalHazardsModel';
import FullScopeModel from '../../../shared-types/src/lib/types/modelTypes/largeModels/fullScopeModel';
import { InternalEvents } from './schemas/internal-events.schema';
import { InternalHazards } from './schemas/internal-hazards.schema';
import { TypedModel, TypedModelJSON } from './schemas/templateSchema/typed-model.schema';

@Controller()
export class TypedModelController {
  constructor(private typedModelService: TypedModelService) {}

  //all the post methods go here

  /**
   * 
   * @param internalEventsModel takes in an internal events model that needs to be added to the database with a dummy id
   * @returns a promise of internalEventsModel
   */
  @Post('/internal-events/')
  async createInternalEvent(@Body() internalEventsModel: Partial<InternalEvents>): Promise<TypedModel> {
    return this.typedModelService.createInternalEventModel(internalEventsModel);
  }

  /**
   * 
   * @param internalHazardsModel takes in an internalHazardsModel with all fields but a dummy id
   * @returns a promise with an internalHazardsModel
   */
  @Post('/internal-hazards/')
  async createInternalHazard( @Body() internalHazardsModel: Partial<InternalHazards>): Promise<TypedModel> {
    return this.typedModelService.createInternalHazardModel(internalHazardsModel);
  }

  /**
   * 
   * @param externalHazardsModel takes in an externalHazardsModel with all fields, and a dummy id
   * @returns promise of an externalHazardsModel
   */
  @Post('/external-hazards/')
  async createExternalHazard( @Body() externalHazardsModel: Partial<ExternalHazardsModel>): Promise<TypedModel> {
    return this.typedModelService.createExternalHazardModel(externalHazardsModel);
  }

  /**
   * 
   * @param fullScopeModel takes in a fullScopeModel with a dummy id
   * @returns a promise of fullScopeModel
   */
  @Post('/full-scope/')
  async createFullScope( @Body() fullScopeModel: Partial<FullScopeModel>): Promise<TypedModel> {
    return this.typedModelService.createFullScopeModel(fullScopeModel);
  }

  //patch methods, used because there is a lot of nested data that is handled at those endpoints in the future

  /**
   * gets a single internal event
   * @param modelId id of the model to be returned
   * @param userId id of the user getting the model
   * @returns the internal event the user has with the modelId
   */
  @Patch('/internal-events/:id')
  async patchInternalEvent(@Param('id') modelId: number, @Query('userId') userId: number, @Body() model: Partial<InternalEventsModel>): Promise<InternalEventsModel> {
    return this.typedModelService.patchInternalEvent(modelId, userId, model);
  }

  /**
   * gets a single internal hazard
   * @param modelId id of the model to be returned
   * @param userId id of the user getting the model
   * @returns the internal hazard the user has with the modelId
   */
  @Patch('/internal-hazards/:id')
  async patchInternalHazard(@Param('id') modelId: number, @Query('userId') userId: number, @Body() model: Partial<InternalHazardsModel>): Promise<InternalHazardsModel> {
    return this.typedModelService.patchInternalHazard(modelId, userId, model);
  }

  /**
   * updates and replaces a single
   * @param modelId id of the model to be returned
   * @param userId id of the user getting the model
   * @returns the external hazard the user has with the modelId
   */
  @Patch('/external-hazards/:id')
  async patchExternalHazard(@Param('id') modelId: number, @Query('userId') userId: number, @Body() model: Partial<ExternalHazardsModel>): Promise<ExternalHazardsModel> {
    return this.typedModelService.patchExternalHazard(modelId, userId, model);
  }

  /**
   * gets a single full scope
   * @param modelId id of the model to be returned
   * @param userId id of the user getting the model
   * @returns the full scope the user has with the modelId
   */
  @Patch('/full-scope/:id')
  async patchFullScope(@Param('id') modelId: number, @Query('userId') userId: number, @Body() model: Partial<FullScopeModel>): Promise<FullScopeModel> {
    return this.typedModelService.patchFullScope(modelId, userId, model);
  }

  //get methods for collections

  /**
   * 
   * @param id the id of the user whose models you want to retrieve
   * @returns a list of the internal hazards moodels the user is on
   */
  @Get('/internal-events/')
  async getInternalEvents(@Query('id') id: number): Promise<InternalEventsModel[]> {
    return this.typedModelService.getInternalEvents(id);
  }

  /**
   * 
   * @param id the id of the user whose models you want to retrieve
   * @returns a list of the internal hazards moodels the user is on
   */
  @Get('/internal-hazards/')
  async getInternalHazards(@Query('id') id: number): Promise<InternalHazardsModel[]> {
    return this.typedModelService.getInternalHazards(id);
  }

  /**
   * 
   * @param id the id of the user whose models you want to retrieve
   * @returns a list of the internal hazards moodels the user is on
   */
  @Get('/external-hazards/')
  async getExternalHazards(@Query('id') id: number): Promise<ExternalHazardsModel[]> {
    return this.typedModelService.getExternalHazards(id);
  }

  /**
   * 
   * @param id the id of the user whose models you want to retrieve
   * @returns a list of the full scope models the user is on
   */
  @Get('/full-scope/')
  async getFullScopes(@Query('id') id: number): Promise<FullScopeModel[]> {
    return this.typedModelService.getFullScopes(id);
  }

  //get methods for singles

  /**
   * gets a single internal event
   * @param modelId id of the model to be returned
   * @param userId id of the user getting the model
   * @returns the internal event the user has with the modelId
   */
  @Get('/internal-events/:id')
  async getInternalEvent(@Param('id') modelId: number, @Query('userId') userId: number): Promise<InternalEventsModel> {
    return this.typedModelService.getInternalEvent(modelId, userId);
  }

  /**
   * gets a single internal hazard
   * @param modelId id of the model to be returned
   * @param userId id of the user getting the model
   * @returns the internal hazard the user has with the modelId
   */
  @Get('/internal-hazards/:id')
  async getInternalHazard(@Param('id') modelId: number, @Query('userId') userId: number): Promise<InternalHazardsModel> {
    return this.typedModelService.getInternalHazard(modelId, userId);
  }

  /**
   * gets a single external hazard
   * @param modelId id of the model to be returned
   * @param userId id of the user getting the model
   * @returns the external hazard the user has with the modelId
   */
  @Get('/external-hazards/:id')
  async getExternalHazard(@Param('id') modelId: number, @Query('userId') userId: number): Promise<ExternalHazardsModel> {
    return this.typedModelService.getExternalHazard(modelId, userId);
  }

  /**
   * gets a single full scope
   * @param modelId id of the model to be returned
   * @param userId id of the user getting the model
   * @returns the full scope the user has with the modelId
   */
  @Get('/full-scope/:id')
  async getFullScope(@Param('id') modelId: number, @Query('userId') userId: number): Promise<FullScopeModel> {
    return this.typedModelService.getFullScope(modelId, userId);
  }

  //delete methods

  /**
   * 
   * @param modelId id of the model to be deleted
   * @returns the deleted model in a promise
   */
  @Delete('/internal-events/')
  async deleteInternalEvent(@Query('modelId') modelId: number): Promise<InternalEventsModel> {
    return this.typedModelService.deleteInternalEvent(modelId);
  }

  /**
   * 
   * @param modelId id of the model to be deleted
   * @returns the deleted model in a promise
   */
  @Delete('/internal-hazards/')
  async deleteInternalHazard(@Query('modelId') modelId: number): Promise<InternalEventsModel> {
    return this.typedModelService.deleteInternalHazard(modelId);
  }

  /**
   * 
   * @param modelId id of the model to be deleted
   * @returns the deleted model in a promise
   */
  @Delete('/external-hazards/')
  async deleteExternalHazard(@Query('modelId') modelId: number): Promise<InternalEventsModel> {
    return this.typedModelService.deleteExternalHazard(modelId);
  }

  /**
   * 
   * @param modelId id of the model to be deleted
   * @returns the deleted model in a promise
   */
  @Delete('/full-scope/')
  async deleteFullScope(@Query('modelId') modelId: number): Promise<InternalEventsModel> {
    return this.typedModelService.deleteFullScope(modelId);
  }

  //endpoints for adding a nested model id
  
  /**
   * updates internal events model
   * @param body modelId number, nestedId number, and a nestedType camelCase string
   * @returns promise with udpated model
   */
  @Patch('/internal-events/')
  async addNestedToInternalEvent(@Body() body: { modelId: number, nestedId: number, nestedType: string } ): Promise<TypedModelJSON> {
    return this.typedModelService.addNestedToInternalEvent(body.modelId, body.nestedId, body.nestedType);
  }

  /**
   * updates internal hazards model
   * @param body modelId number, nestedId number, and a nestedType camelCase string
   * @returns promise with udpated model
   */
  @Patch('/internal-hazards/')
  async addNestedToInternalHazard(@Body() body: { modelId: number, nestedId: number, nestedType: string } ): Promise<TypedModelJSON> {
    return this.typedModelService.addNestedToInternalHazard(body.modelId, body.nestedId, body.nestedType);
  }

  /**
   * updates external hazards model
   * @param body modelId number, nestedId number, and a nestedType camelCase string
   * @returns promise with udpated model
   */
  @Patch('/external-hazard/')
  async addNestedToExternalHazard(@Body() body: { modelId: number, nestedId: number, nestedType: string } ): Promise<TypedModelJSON> {
    return this.typedModelService.addNestedToExternalHazard(body.modelId, body.nestedId, body.nestedType);
  }

  /**
   * updates full scope model
   * @param body modelId number, nestedId number, and a nestedType camelCase string
   * @returns promise with udpated model
   */
  @Patch('/full-scope/')
  async addNestedToFullScope(@Body() body: { modelId: number, nestedId: number, nestedType: string } ): Promise<TypedModelJSON> {
    return this.typedModelService.addNestedToFullScope(body.modelId, body.nestedId, body.nestedType);
  }

  //for deleting nested model ids

  @Patch('/internal-events/:id/delete-nested')
  async deleteNestedFromInternalEvent(@Param ('id') id: number, @Body() body: { nestedId: number, nestedType: string } ): Promise<TypedModelJSON> {
    return this.typedModelService.deleteNestedFromInternalEvent(id, body.nestedId, body.nestedType);
  }

  @Patch('/internal-hazards/:id/delete-nested')
  async deleteNestedFromInternalHazard(@Param ('id') id: number, @Body() body: { nestedId: number, nestedType: string } ): Promise<TypedModelJSON> {
    return this.typedModelService.deleteNestedFromInternalHazard(id, body.nestedId, body.nestedType);
  }

  @Patch('/external-hazards/:id/delete-nested')
  async deleteNestedFromExternalHazard(@Param ('id') id: number, @Body() body: { nestedId: number, nestedType: string } ): Promise<TypedModelJSON> {
    return this.typedModelService.deleteNestedFromExternalHazard(id, body.nestedId, body.nestedType);
  }

  @Patch('/full-scope/:id/delete-nested')
  async deleteNestedFromFullScope(@Param ('id') id: number, @Body() body: { nestedId: number, nestedType: string } ): Promise<TypedModelJSON> {
    return this.typedModelService.deleteNestedFromFullScope(id, body.nestedId, body.nestedType);
  }
}
