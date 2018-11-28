'use strict';

import models from '../../models/index';

const mockState = (stateId, total, region) => {
  return models.state.create({
    stateId, total, region,
  });
};

const removeMocks = () => {
  return models.state.destroy({ cascade: true, truncate: true });
};

export { mockState, removeMocks };
