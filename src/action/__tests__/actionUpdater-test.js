/* eslint-env node, jest */

const u = require('updeep');

const actionUpdater = require('../actionUpdater');
const baseAction = require('../action');
const baseServer = require('../../server');
const createBackup = require('../../createBackup');
const state = require('../state');

describe('actionUpdater', () => {
  let action;
  let backup;
  let server;
  let updater;

  beforeEach(() => {
    action = u({
      title: 'Test action',
      action: u.constant(() => {})
    }, baseAction);

    server = u({
      actions: [
        action
      ]
    }, baseServer);

    backup = createBackup(server);
    updater = actionUpdater(action);
  });

  describe('setState', () => {
    it('should update the state of the specified action', () => {
      const updatedBackup = updater.setState(backup, state.SKIPPED);

      expect(updatedBackup).toEqual(expect.objectContaining({
        server: expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({
              state: state.SKIPPED
            })
          ])
        })
      }));
    });

    it('should be able to set state multiple times', () => {
      let updatedBackup = updater.setState(backup, state.SKIPPED);

      expect(updatedBackup).toEqual(expect.objectContaining({
        server: expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({
              state: state.SKIPPED
            })
          ])
        })
      }));

      updatedBackup = updater.setState(updatedBackup, state.COMPLETED);

      expect(updatedBackup).toEqual(expect.objectContaining({
        server: expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({
              state: state.COMPLETED
            })
          ])
        })
      }));
    });
  });

  describe('pending', () => {
    it('should set the correct state', () => {
      const updatedBackup = updater.pending(backup);

      expect(updatedBackup).toEqual(expect.objectContaining({
        server: expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({
              state: state.PENDING
            })
          ])
        })
      }));
    });
  });

  describe('completed', () => {
    it('should set the correct state', () => {
      const updatedBackup = updater.completed(backup);

      expect(updatedBackup).toEqual(expect.objectContaining({
        server: expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({
              state: state.COMPLETED
            })
          ])
        })
      }));
    });
  });

  describe('failed', () => {
    const error = new Error('Test error');

    it('should set the correct state', () => {
      const updatedBackup = updater.failed(backup, error);

      expect(updatedBackup).toEqual(expect.objectContaining({
        server: expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({
              state: state.FAILED
            })
          ])
        })
      }));
    });

    it('should set an error', () => {
      const updatedBackup = updater.failed(backup, error);

      expect(updatedBackup).toEqual(expect.objectContaining({
        server: expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({
              error
            })
          ])
        })
      }));
    });
  });

  describe('skipped', () => {
    const reason = 'Test reason';

    it('should set the correct state', () => {
      const updatedBackup = updater.skipped(backup, reason);

      expect(updatedBackup).toEqual(expect.objectContaining({
        server: expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({
              state: state.SKIPPED
            })
          ])
        })
      }));
    });

    it('should set a skip reason', () => {
      const updatedBackup = updater.skipped(backup, reason);

      expect(updatedBackup).toEqual(expect.objectContaining({
        server: expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({
              reason
            })
          ])
        })
      }));
    });
  });
});
