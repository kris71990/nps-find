'use strict';

import faker from 'faker';
import models from '../../models';
import { createAccountMock, removeAccountMock } from './account-mock';

const createProfileMock = () => {
  const resultMock = {};

  return createAccountMock()
    .then((accountSetMock) => {
      resultMock.accountSetMock = accountSetMock;

      return models.profile.create({
        firstName: faker.name.firstName(),
        age: faker.random.number(),
        homeState: faker.address.state(),
        account: accountSetMock.account._id,
      });
    })
    .then((profile) => {
      resultMock.profile = profile;
      return resultMock;
    });
};

const removeProfileMock = () => {
  return Promise.all([
    models.profile.destroy({ where: {} }),
    removeAccountMock(),
  ]);
};

export { createProfileMock, removeProfileMock };
