import Lab from '@hapi/lab';
import Sinon from 'sinon';
import Code from 'code';
import * as Faker from 'faker';
import { factory } from 'typeorm-seeding';
import { lab } from '../../setup';
import { Activity } from '../../../src/model/activity';
import * as Resource from '../../../src/app/activity/resource';
import { User } from '../../../src/model/user';
import { delta } from '../../../src/utils/deep-diff';

exports.lab = Lab.script();
const Sandbox = Sinon.createSandbox();

lab.afterEach(() => {
  Sandbox.restore();
});

lab.experiment('Activity::resource', () => {
  lab.experiment('create activity', () => {
    lab.afterEach(() => {
      Sandbox.restore();
    });

    lab.test('should create activity with delta', async () => {
      const activity = {
        createdAt: 'Fri Mar 12 2021 13:24:53 GMT+0530 (India Standard Time)',
        diffs: [
          { rhs: 'p', kind: 'N', path: ['ptype'] },
          {
            rhs: { group: '231d7c4c-d3c4-4bff-aacc-d7b0cf197edf' },
            kind: 'N',
            path: ['subject']
          },
          {
            rhs: { group: '231d7c4c-d3c4-4bff-aacc-d7b0cf197edf' },
            kind: 'N',
            path: ['resource']
          },
          {
            rhs: { role: 'd56e6288-6d67-43bc-8062-69bde9835312' },
            kind: 'N',
            path: ['action']
          }
        ],
        document: {},
        documentId: 'ba256f55-bfce-4d17-8174-a0abbf26ccd4',
        model: 'User',
        title: 'Bypass Chips heuristic'
      };
      const activityId = Faker.random.uuid();
      const activitySaveStub = Sandbox.stub(Activity, 'save').returns(<any>{
        id: activityId,
        ...activity
      });
      const response = await Resource.create(activity);
      Sandbox.assert.calledWithExactly(activitySaveStub, <any>activity);
      Code.expect(response).to.equal({ id: activityId, ...activity });
    });

    lab.test('should create activity without delta', async () => {
      const activity = {
        createdAt: 'Fri Mar 12 2021 13:24:53 GMT+0530 (India Standard Time)',
        diffs: [],
        document: {},
        documentId: 'ba256f55-bfce-4d17-8174-a0abbf26ccd4',
        model: 'User',
        title: 'Bypass Chips heuristic'
      };
      const response = await Resource.create(activity);
      Code.expect(response).to.equal(null);
    });
  });

  lab.experiment('log activity', () => {
    lab.afterEach(() => {
      Sandbox.restore();
    });

    lab.test(
      'should log activity by typeorm subscriber after insert event',
      async () => {
        const user = await factory(User)().create();
        const activityId = Faker.random.uuid();
        const event = {
          metadata: {
            tableName: 'groups'
          },
          entity: {
            id: activityId,
            displayname: 'Mock',
            first: 'First',
            second: 'Second',
            metadata: {
              key: 'value',
              number: 1,
              bool: true
            },
            createdAt: 'Fri Mar 12 2021 13:24:53 GMT+0530 (India Standard Time)'
          },
          queryRunner: {
            data: {
              user
            }
          }
        };

        const activity = {
          document: {},
          documentId: '0',
          diffs: delta({}, event.entity, {
            exclude: ['createdAt', 'updatedAt']
          }),
          title: 'Created Mock team ',
          createdBy: user
        };

        Sandbox.stub(Activity, 'create').returns(<any>{
          id: activityId,
          ...activity
        });
        await Resource.log(event, Resource.actions.CREATE);
      }
    );

    lab.test(
      'should log activity by typeorm subscriber after update event',
      async () => {
        const user = await factory(User)().create();
        const activityId = Faker.random.uuid();
        const event = {
          metadata: {
            tableName: 'groups'
          },
          databaseEntity: {
            id: activityId,
            displayname: 'Mock',
            first: 'First',
            second: 'Second',
            metadata: {
              key: 'value',
              number: 1,
              bool: true
            },
            createdAt: 'Fri Mar 12 2021 13:24:53 GMT+0530 (India Standard Time)'
          },
          entity: {
            id: activityId,
            displayname: 'Mock',
            first: 'First Edited',
            second: 'Second',
            metadata: {
              key: 'value edited',
              number: 2,
              bool: true
            },
            createdAt: 'Fri Mar 12 2021 13:24:53 GMT+0530 (India Standard Time)'
          },
          queryRunner: {
            data: {
              user
            }
          }
        };

        const activity = {
          document: {
            id: activityId,
            displayname: 'Mock',
            first: 'First',
            second: 'Second',
            metadata: {
              key: 'value',
              number: 1,
              bool: true
            },
            createdAt: 'Fri Mar 12 2021 13:24:53 GMT+0530 (India Standard Time)'
          },
          documentId: activityId,
          diffs: delta(event.databaseEntity, event.entity, {
            exclude: ['createdAt', 'updatedAt']
          }),
          title: 'Edited Mock team ',
          createdBy: user
        };

        Sandbox.stub(Activity, 'create').returns(<any>{
          id: activityId,
          ...activity
        });
        await Resource.log(event, Resource.actions.EDIT);
      }
    );

    lab.test(
      'should log activity by typeorm subscriber after remove event',
      async () => {
        const user = await factory(User)().create();
        const activityId = Faker.random.uuid();
        const event = {
          metadata: {
            tableName: 'groups'
          },
          databaseEntity: {
            id: activityId,
            displayname: 'Mock',
            first: 'First',
            second: 'Second',
            metadata: {
              key: 'value',
              number: 1,
              bool: true
            },
            createdAt: 'Fri Mar 12 2021 13:24:53 GMT+0530 (India Standard Time)'
          },
          entity: {},
          queryRunner: {
            data: {
              user
            }
          }
        };

        const activity = {
          document: {
            id: activityId,
            displayname: 'Mock',
            first: 'First',
            second: 'Second',
            metadata: {
              key: 'value',
              number: 1,
              bool: true
            },
            createdAt: 'Fri Mar 12 2021 13:24:53 GMT+0530 (India Standard Time)'
          },
          documentId: activityId,
          diffs: delta(event.databaseEntity, event.entity, {
            exclude: ['createdAt', 'updatedAt']
          }),
          title: 'Removed Mock team ',
          createdBy: user
        };

        Sandbox.stub(Activity, 'create').returns(<any>{
          id: activityId,
          ...activity
        });
        await Resource.log(event, Resource.actions.DELETE);
      }
    );
  });
});
