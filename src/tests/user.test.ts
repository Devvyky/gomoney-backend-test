import mongoose from 'mongoose';
import request from 'supertest';

import app from '../app';
import * as authService from '../user/services/authService';

const userId = new mongoose.Types.ObjectId().toString();
const userPayload = {
  _id: userId,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
};

const userInput = {
  name: 'John Doe',
  email: 'john@examples.com',
  password: '123456',
};

let server: any;
describe('User Test', () => {
  describe('user registration', () => {
    describe('given the email and password are valid', () => {
      it('should return a status code of 201 with message', async () => {
        const createUserServiceMock = jest
          .spyOn(authService, 'signup')
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await request(app)
          .post('/api/v1/user/signup')
          .send(userInput);

        expect(statusCode).toBe(201);
        expect(body.message).toEqual('User signup successful');
        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    describe('given the user service throws an error', () => {
      it('should handle the error on signup', async () => {
        const createUserServiceMock = jest
          .spyOn(authService, 'signup')
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await request(app).post(
          '/api/v1/user/signup'
        );

        expect(statusCode).not.toBe(201);
      });
    });
  });
  // the email and password gets validation
  // verify that the handler handles any errors

  // login user
});
