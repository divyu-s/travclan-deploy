export const initialState = {
  customerList: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_CUSTOMERS":
      return {
        ...state,
        customerList: [...action.list],
      };

    default:
      return state;
  }
};

export default reducer;