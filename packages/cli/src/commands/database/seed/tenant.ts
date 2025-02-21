import { generateStandardId } from '@logto/core-kit';
import { CreateRolesScope } from '@logto/schemas';
import type { TenantModel, AdminData } from '@logto/schemas';
import { createTenantMetadata } from '@logto/shared';
import { assert } from '@silverhand/essentials';
import type { CommonQueryMethods } from 'slonik';
import { sql } from 'slonik';
import { raw } from 'slonik-sql-tag-raw';

import { insertInto } from '../../../database.js';
import { getDatabaseName } from '../../../queries/database.js';

export const createTenant = async (pool: CommonQueryMethods, tenantId: string) => {
  const database = await getDatabaseName(pool, true);
  const { parentRole, role, password } = createTenantMetadata(database, tenantId);
  const tenantModel: TenantModel = { id: tenantId, dbUser: role, dbUserPassword: password };

  await pool.query(insertInto(tenantModel, 'tenants'));
  await pool.query(sql`
    create role ${sql.identifier([role])} with inherit login
      password '${raw(password)}'
      in role ${sql.identifier([parentRole])};
  `);
};

export const seedAdminData = async (pool: CommonQueryMethods, data: AdminData) => {
  const { resource, scope, role } = data;

  assert(
    resource.tenantId === scope.tenantId && scope.tenantId === role.tenantId,
    new Error('All data should have the same tenant ID')
  );

  await pool.query(insertInto(resource, 'resources'));
  await pool.query(insertInto(scope, 'scopes'));
  await pool.query(insertInto(role, 'roles'));
  await pool.query(
    insertInto(
      {
        id: generateStandardId(),
        roleId: role.id,
        scopeId: scope.id,
        tenantId: resource.tenantId,
      } satisfies CreateRolesScope,
      'roles_scopes'
    )
  );
};
