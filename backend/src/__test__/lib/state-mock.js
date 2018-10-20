'use strict';

import models from '../../models/index';

const mockState = (stateId, total) => {
  return models.state.create({
    stateId, total,
  });
};

const removeMocks = () => {
  return models.state.destroy({ cascade: true });
};

export { mockState, removeMocks };
