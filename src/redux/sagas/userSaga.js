import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('api/user', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.error('User get request failed', error);
  }
}

function* fetchUsers(){
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('api/user/list', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USERS', payload: response.data });
  } catch (error) {
    console.error('Users get request failed', error);
  }
}

function* updateUserActivity(action){
  try {

    // Destructure variable from client
    const {id} = action.payload;

    // Request API to update activity
    yield axios.put(`/api/user/active/${id}`)

    // update redux
    yield put({type:'FETCH_USERS'});

  } catch (error) {
    console.error(`Error in updateUserActivity: ${error}`);
  }
};

function* updateUserAdmin(action) {
  try {
    const { id } = action.payload;
    yield axios.put(`/api/user/admin/${id}`)
    yield put({ type: 'FETCH_USERS' });
  } catch (error) {
    console.error(`Error in updateUserAdmin: ${error}`);
  }
};

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('FETCH_USERS', fetchUsers);
  yield takeLatest('UPDATE_USER_ACTIVITY', updateUserActivity)
  yield takeLatest('UPDATE_USER_ADMIN', updateUserAdmin)
};

export default userSaga;
