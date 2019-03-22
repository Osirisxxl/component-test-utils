// The part of code should strictly follow the react dispatcher implementation as it's mainly a mock of it
// https://github.com/facebook/react/blob/master/packages/react/src/ReactHooks.js

class Dispatcher {
  /* ReadContext: () => {},
    useCallback: () => {},
    useContext: () => {},
    useDebugValue: () => {},
    useImperativeHandle: () => {},
    useLayoutEffect: () => {},
    useMemo: () => {},
    useReducer: () => {},
    useRef: () => {}, */

  constructor(shallowedComponent) {
    this._hookStorage = [];
    this._firstCall = true;
    this._shallowedComponent = shallowedComponent;
    this._currentHookIndex = 0;
  }

  _informDipatcherRenderIsDone() {
    this._currentHookIndex = 0;
    this._firstCall = false;
  }

  _getHookIndex() {
    const hookIndex = this._currentHookIndex;
    this._currentHookIndex++;
    return hookIndex;
  }

  useState(initialState) {
    const hookIndex = this._getHookIndex();

    if (this._firstCall) {
      this._hookStorage.push(initialState);
    }

    return [
      this._hookStorage[hookIndex],
      newValue => {
        this._hookStorage[hookIndex] = newValue;
        // Updating the state trigger a render
        this._shallowedComponent._render();
      }
    ];
  }

  useEffect(fn, memo) {
    const hookIndex = this._getHookIndex();

    const haveMemo = this._hookStorage[hookIndex];
    // If effect have no memo, consider memo have changed
    const haveSameMemo =
      haveMemo &&
      (this._hookStorage[hookIndex] === memo ||
        !this._hookStorage[hookIndex].find(
          (runningMemo, i) => runningMemo !== memo[i]
        ));

    if (!haveSameMemo) {
      this._hookStorage[hookIndex] = memo;
      fn();
    }
  }
}

exports.createDispatcher = shallowedComponent => {
  return new Dispatcher(shallowedComponent);
};