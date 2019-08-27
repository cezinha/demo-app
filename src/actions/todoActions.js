export const TodoAddStart = () => ({
  type: "ADD_TODO",
});

export const TodoAdd = () => {
  return dispatch => {
    dispatch(TodoAddStart());
  }
}