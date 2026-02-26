import type {
  RoleDataRepository,
  RoleFilterQuery,
  RoleItemDto,
  RolePageResponseDto,
  RolePageViewModel,
} from './types';

const MOCK_ROLES: RoleItemDto[] = [
  {
    id: 'role-1',
    roleName: 'IT_ADMIN',
    userCount: 3,
    permissions: [
      'Transaction Read',
      'Transaction Write',
      'Report Read',
      'User Write',
      'Role Write',
      'Audit Log Read',
      'Bank Account Write',
      'System Read',
      'Callback Write',
      'Callback Read',
      'User Read',
      'IT Admin Permission Write',
      'Role Read',
      'Exception Read',
    ],
  },
  {
    id: 'role-2',
    roleName: 'OPERATOR',
    userCount: 0,
    permissions: [
      'Transaction Write',
      'Report Read',
      'Transaction Read',
      'Bank Account Write',
      'System Read',
      'User Read',
      'Bank Account Read',
      'Exception Write',
      'Role Read',
      'Exception Read',
    ],
  },
  {
    id: 'role-3',
    roleName: 'VIEWER',
    userCount: 0,
    permissions: [
      'Report Read',
      'Transaction Read',
      'System Read',
      'User Read',
      'Bank Account Read',
      'Role Read',
      'Exception Read',
    ],
  },
  {
    id: 'role-4',
    roleName: 'ADMIN',
    userCount: 9,
    permissions: [
      'Transaction Read',
      'Transaction Write',
      'Report Read',
      'User Write',
      'Role Write',
      'Audit Log Read',
      'Bank Account Write',
      'System Read',
      'Callback Write',
      'Callback Read',
      'User Read',
      'Bank Account Read',
      'Exception Write',
      'Role Read',
      'Exception Read',
    ],
  },
  {
    id: 'role-5',
    roleName: 'USER',
    userCount: 0,
    permissions: [],
  },
];

const normalize = (value: string) => value.trim().toLowerCase();

const filterRoles = (rows: RoleItemDto[], query?: RoleFilterQuery): RoleItemDto[] => {
  if (!query) {
    return rows;
  }

  const normalizedRoleName = normalize(query.roleName ?? '');
  const normalizedPermission = normalize(query.permission ?? '');

  return rows.filter((row) => {
    const roleNameMatch =
      normalizedRoleName.length === 0 || normalize(row.roleName).includes(normalizedRoleName);

    const permissionMatch =
      normalizedPermission.length === 0 ||
      row.permissions.some((permission) => normalize(permission).includes(normalizedPermission));

    return roleNameMatch && permissionMatch;
  });
};

export const mapRolePageDtoToViewModel = (dto: RolePageResponseDto): RolePageViewModel => ({
  rows: dto.roles.map((role) => ({
    id: role.id,
    roleName: role.roleName,
    userCount: role.userCount,
    permissions: role.permissions,
  })),
});

export class MockRoleRepository implements RoleDataRepository {
  async listRolePageData(query?: RoleFilterQuery): Promise<RolePageResponseDto> {
    return {
      roles: filterRoles(MOCK_ROLES, query),
    };
  }
}
