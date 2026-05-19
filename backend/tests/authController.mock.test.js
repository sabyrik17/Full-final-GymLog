import { createWorkout } from '../src/controllers/workoutController.js';
import { logout } from '../src/controllers/authController.js';

const makeResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('Express route handlers mocked', () => {
  it('logout returns a success message', () => {
    const res = makeResponse();

    logout({}, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
  });

  it('createWorkout validates title and date before touching the database', async () => {
    const req = {
      userId: 'user-id',
      body: { title: '', date: '' },
    };
    const res = makeResponse();
    const next = jest.fn();

    await createWorkout(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Please provide workout title and date' });
    expect(next).not.toHaveBeenCalled();
  });
});
