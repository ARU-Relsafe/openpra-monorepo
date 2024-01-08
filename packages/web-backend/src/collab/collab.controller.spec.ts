import { Test, TestingModule } from '@nestjs/testing';
import { CollabService } from './collab.service';
import { CollabController } from './collab.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UserCounter, UserCounterSchema } from './schemas/user-counter.schema';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection } from 'mongoose';

describe('CollabController', () => {
  let collabService: CollabService;
  let collabController: CollabController;
  let mongoServer: MongoMemoryServer;
  let connection: Connection;

  /**
   * Before any test is run, start a new in-memory MongoDB instance and connect to it.
   * Create a new module with the CollabService and CollabController.
   * make connection object and collabService and collabController available to all tests.
   */
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    await mongoServer.start();
    const mongoUri = mongoServer.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports:[
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
          { name: UserCounter.name, schema: UserCounterSchema }])
      ],
      providers: [CollabService],
      controllers: [CollabController]
    }).compile();
    connection = await module.get(getConnectionToken());
    collabService = module.get<CollabService>(CollabService);
    collabController = module.get<CollabController>(CollabController);
  });

  /**
   * after each test, drop the database
   */
  afterEach(async () => {
    await connection.dropDatabase();
  });
  
  /**
   * After all tests are done, disconnect from mongoose and stop the in-memory MongoDB instance.
   */
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('CollabController', () => {
    /**
     * Test that the CollabController is defined
     */
    it("CollabController should be defined", async () => {
        expect(collabController).toBeDefined();
    });
  });

  describe('createNewUser', () => {

    it("should be defined",async () =>{
      expect(collabController.createNewUser).toBeDefined();
    });
    /**
     * create user_object and pass it to createNewUser function
     * expect result to be defined
     */
    it("should create a user", async () => {
      const user_object={firstName:'User1',lastName:'Last1',email:'xyz@gmail.com',username:'testUser',password:'12345678'}
      let response = await collabController.createNewUser(user_object);
      expect(response).toBeDefined(); //expect result to be defined, if login is successfulexpect(result).toBeDefined();
    });
  });

  describe('getUserPreferences', () => {
    it("should be defined",async () =>{
      expect(collabController.getUserPreferences).toBeDefined();
    });
    
    /**
     * create user_object and pass it to createNewUser function
     * call getUserPreferences using the userId returned from createNewUser
     * expect preferences to be defined for user
     */
    it("should return user preferences", async () => {
        const user_object={firstName:'User1',lastName:'Last1',email:'xyz@gmail.com',username:'testUser',password:'12345678'}
        let response = await collabService.createNewUser(user_object);
        let userId = String(response.id);
        const result = await collabController.getUserPreferences(userId);
        expect(result).toBeDefined(); //expect preferences to be defined for user
      });
  });

  describe('updateUserPreferences', () => {
    it("should be defined",async () =>{
      expect(collabController.updateUserPreferences).toBeDefined();
    });
    
    /**
     * create user_object and userPreferenceObject
     * call createNewUser using user_object
     * call updateUserPreferences using the userId returned from createNewUser and userPreferenceObject
     * expect preferences to be updated for user
     */
    it("should update user preferences - theme", async () => {
      const user_object={firstName:'User1',lastName:'Last1',email:'xyz@gmail.com',username:'testUser',password:'12345678'}
      const userPreferenceObject = {preferences:{theme:'Dark'}}
      let response = await collabService.createNewUser(user_object);
      let userId = String(response.id);
      const result = await collabController.updateUserPreferences(userId,userPreferenceObject);
      expect(result?.preferences.theme).toMatch('Dark');
    });
  
    it("should update user preferences - nodeIdsVisible", async () => {
      const user_object={firstName:'User1',lastName:'Last1',email:'xyz@gmail.com',username:'testUser',password:'12345678'}
      const userPreferenceObject = {preferences:{nodeIdsVisible:false}}
      let response = await collabService.createNewUser(user_object);
      let userId = String(response.id);
      const result = await collabController.updateUserPreferences(userId,userPreferenceObject);
      expect(result?.preferences.nodeIdsVisible).toBeFalsy();
    });
      
    it("should update user preferences - outlineVisible", async () => {
      const user_object={firstName:'User1',lastName:'Last1',email:'xyz@gmail.com',username:'testUser',password:'12345678'}
      const userPreferenceObject = {preferences:{outlineVisible:false}}
      let response = await collabService.createNewUser(user_object);
      let userId = String(response.id);
      const result = await collabController.updateUserPreferences(userId,userPreferenceObject);
      expect(result?.preferences.outlineVisible).toBeFalsy();
    });
  });
});