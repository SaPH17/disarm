export const permissionToJson = (
  permissions: any[],
  availablePermission: any[]
) => {
  let result: any = {};

  permissions.forEach((val) => {
    if (availablePermission.find((p) => p.id === val.id)) {
      assignValue(
        result,
        val.action.toLowerCase(),
        val.objectType.toLowerCase(),
        val.objectId
      );
    }
  });

  return JSON.stringify(result);
};

const assignValue = (obj: any, action: string, type: string, val: string) => {
  obj = obj[action] = obj[action] || {};
  obj = obj[type] = obj[type] || [];
  obj.push(val);
};

export const stepsToJson = (steps: any[]) => {
  return JSON.stringify(steps);
};
