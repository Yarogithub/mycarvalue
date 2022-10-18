import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email:string) => {
        return Promise.resolve([ { id:1,
          email:email,
          password:'asdada'
        } as User]);
      },
      findOne: (id:number) => {
        // const filteredUsers = users.
        return Promise.resolve(
          { id,
            email:'asda@asda.com',
            password:'asdada'
          } as User);
      },
      create: (email:string,password:string) =>{
        const user = {
          id:Math.floor(Math.random() * 999999),
          email,
          password
        } as User;
        return Promise.resolve(user);
      },
      // remove: (id:number) => {
      //   // const filteredUsers = users.pop(user => user.id === id)
      //   return Promise.resolve(filteredUsers);
      // },
      // update: (email:string) => {
      //   const filteredUsers = users.filter(user => user.email === email)
      //   return Promise.resolve(filteredUsers);
      // },
    }

    fakeAuthService = {
      // signup: (email:string) => {
      //   const filteredUsers = users.filter(user => user.email === email)
      //   return Promise.resolve(filteredUsers);
      // },
      signin: (email:string,password:string) =>{
        return Promise.resolve({
          id:1,
          email,
          password
        } as User);
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide:AuthService,
          useValue: fakeAuthService
        },
        {
          provide:UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users returns a list of users with given email', async () => {
    const users = await controller.findAllUsers('asdaad@dasja.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdaad@dasja.com');
  });

  it('find user returns a single user with given id', async () => {
    const users = await controller.findUser('1');
    expect(users).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns a user', async () => {
    const session = {userId: -10};
    const user = await controller.signin({email:'asdad@asda.com',password:"sdaas"},session)

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1)
  });
});
