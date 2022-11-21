export const groups = [
  {
    id: '1',
    name: 'Role Z',
    description: 'Role for admin',
    permissions: '- updateuser.*',
    directParentGroup: 'Role B',
  },
  {
    id: '2',
    name: 'Role B',
    description: 'Role for pentester',
    permissions: '- updateuser.*',
    directParentGroup: 'Role B',
  },
  {
    id: '3',
    name: 'Role C',
    description: 'Role for SysAdmin',
    permissions: '- updateuser.*',
    directParentGroup: 'Role B',
  },
  {
    id: '4',
    name: 'Role D',
    description: 'Role for others',
    permissions: '- updateuser.*',
    directParentGroup: 'Role B',
  },
];