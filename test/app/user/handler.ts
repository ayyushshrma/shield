import Code from 'code';
import Lab from '@hapi/lab';
import Hapi from '@hapi/hapi';
import Sinon from 'sinon';
import { factory } from 'typeorm-seeding';
import { lab } from '../../setup';
import * as Config from '../../../src/config/config';
import * as userPlugin from '../../../src/app/user';
import * as Resource from '../../../src/app/user/resource';
import { User } from '../../../src/model/user';

exports.lab = Lab.script();
let server: Hapi.Server;
const Sandbox = Sinon.createSandbox();

const TEST_AUTH = {
  strategy: 'test',
  credentials: { id: 'demo' }
};

lab.before(async () => {
  const plugins = [userPlugin];
  server = new Hapi.Server({ port: Config.get('/port/web'), debug: false });
  await server.register(plugins);
});

lab.after(async () => {
  await server.stop();
});

lab.afterEach(() => {
  Sandbox.restore();
});

lab.experiment('User::Handler', () => {
  lab.experiment('create user', () => {
    let request, createUserStub, payload, result;

    lab.beforeEach(async () => {
      createUserStub = Sandbox.stub(Resource, 'create');
      payload = {
        displayname: 'test title',
        metadata: {
          name: 'test',
          email: 'test@go-jek.com'
        }
      };
      request = {
        method: 'POST',
        url: `/api/users`,
        payload,
        auth: TEST_AUTH
      };
      result = {
        id: '9efe854e-9f14-4fb0-b6be-6cbef8bbf540',
        username: payload.metadata.name,
        displayname: payload.displayname,
        metadata: payload.metadata,
        createdAt: '2021-03-18T13:06:22.292Z',
        updatedAt: '2021-03-18T13:06:22.292Z'
      };
    });
    lab.afterEach(() => {
      Sandbox.restore();
    });

    lab.test('should update user', async () => {
      await Resource.create(payload);
      createUserStub.resolves(result);
      const response = await server.inject(request);

      Sandbox.assert.calledWithExactly(createUserStub, payload);
      Code.expect(response.result).to.equal(result);
      Code.expect(response.statusCode).to.equal(200);
    });
  });

  lab.experiment('get user by id', () => {
    let request: any, getUserStub: any, user: any;

    lab.beforeEach(async () => {
      user = await factory(User)().create();
      getUserStub = Sandbox.stub(Resource, 'get');
      request = {
        method: 'GET',
        url: `/api/users/${user.id}`,
        auth: TEST_AUTH
      };
    });
    lab.afterEach(() => {
      getUserStub.restore();
    });

    lab.test('should get user by id', async () => {
      getUserStub.resolves(user);
      const response = await server.inject(request);
      Sandbox.assert.calledWithExactly(getUserStub, user.id);
      Code.expect(response.result).to.equal(user);
      Code.expect(response.statusCode).to.equal(200);
    });
  });
});
