import { useRef, useEffect } from "react";

function useDelegator(
  id,
  actions,
  eventActionDefine,
  objectId,
  child_id,
  index,
  { eventCenter, componentCenter }
) {
  let ref = useRef(actions);
  useEffect(() => {
    let initId = id;
    if (child_id) {
      initId = `${initId}__childId__${child_id.substr(0, 10)}`;
    }
    if (index > -1) {
      initId = `${initId}__index__${index}`;
    }
    componentCenter.register(initId, "comp", ref.current, eventActionDefine);
    return () => {
      componentCenter.removeInstance(initId);
    };
  }, [id, actions, eventActionDefine, child_id, index, componentCenter]);
}

export default useDelegator;
