export interface RoleItemDto {
  id: string;
  roleName: string;
  userCount: number;
  permissions: string[];
}

export interface RolePageResponseDto {
  roles: RoleItemDto[];
}

export interface RoleRowViewModel {
  id: string;
  roleName: string;
  userCount: number;
  permissions: string[];
}

export interface RolePageViewModel {
  rows: RoleRowViewModel[];
}

export interface RoleFilterQuery {
  roleName?: string;
  permission?: string;
}

export interface RoleDataRepository {
  listRolePageData(query?: RoleFilterQuery): Promise<RolePageResponseDto>;
}
