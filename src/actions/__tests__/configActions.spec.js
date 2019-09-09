import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../configActions'
import { configConstants } from '../../constants';
import fetchMock from 'fetch-mock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })

  it('creates COMPLETED when fetching config has been done', () => {
    fetchMock.getOnce('/config.json', {
      test: ['do something'],
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: configConstants.STARTED },
      { type: configConstants.COMPLETED, config: { test: ['do something'], headers: { 'content-type': 'application/json' } } }
    ]
    const store = mockStore({ configReducer: { config: {} } })

    return store.dispatch(actions.configLoad({ REMOTE_CONFIG_URL: "/config.json" })).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})