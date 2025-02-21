import { generateStandardId } from '@logto/core-kit';
import type { TenantModel } from '@logto/schemas';
import {
  LogtoConfigs,
  SignInExperiences,
  createDefaultAdminConsoleConfig,
  createDefaultSignInExperience,
  adminTenantId,
  createAdminData,
  createAdminDataInAdminTenant,
} from '@logto/schemas';
import { createTenantMetadata } from '@logto/shared';
import type { ZodType } from 'zod';
import { z } from 'zod';

import type { Queries } from '#src/queries/index.js';
import { createTenantsQueries } from '#src/queries/tenants.js';
import { createUsersQueries } from '#src/queries/users.js';
import { getDatabaseName } from '#src/queries/utils.js';
import { insertInto } from '#src/utils/query.js';
import { getTenantIdFromManagementApiIndicator } from '#src/utils/tenant.js';

export type TenantInfo = {
  id: string;
  indicator: string;
};

export const tenantInfoGuard: ZodType<TenantInfo> = z.object({
  id: z.string(),
  indicator: z.string(),
});

export class TenantsLibrary {
  constructor(public readonly queries: Queries) {}

  async getAvailableTenants(userId: string): Promise<TenantInfo[]> {
    const { getManagementApiLikeIndicatorsForUser } = this.queries.tenants;
    const { rows } = await getManagementApiLikeIndicatorsForUser(userId);

    return rows
      .map(({ indicator }) => ({
        id: getTenantIdFromManagementApiIndicator(indicator),
        indicator,
      }))
      .filter((tenant): tenant is TenantInfo => Boolean(tenant.id));
  }

  async createNewTenant(forUserId: string): Promise<TenantInfo> {
    const databaseName = await getDatabaseName(this.queries.client);
    const { id: tenantId, parentRole, role, password } = createTenantMetadata(databaseName);

    // Init tenant
    const tenantModel: TenantModel = { id: tenantId, dbUser: role, dbUserPassword: password };
    const transaction = await this.queries.client.transaction();
    const tenants = createTenantsQueries(transaction);
    const users = createUsersQueries(transaction);

    // Start
    await transaction.start();

    // Init tenant
    await tenants.insertTenant(tenantModel);
    await tenants.createTenantRole(parentRole, role, password);

    // Create admin data set (resource, roles, etc.)
    const adminDataInAdminTenant = createAdminDataInAdminTenant(tenantId);
    await tenants.insertAdminData(adminDataInAdminTenant);
    await tenants.insertAdminData(createAdminData(tenantId));
    await users.assignRoleToUser({
      id: generateStandardId(),
      tenantId: adminTenantId,
      userId: forUserId,
      roleId: adminDataInAdminTenant.role.id,
    });

    // Create initial configs
    await Promise.all([
      transaction.query(insertInto(createDefaultAdminConsoleConfig(tenantId), LogtoConfigs.table)),
      transaction.query(
        insertInto(createDefaultSignInExperience(tenantId), SignInExperiences.table)
      ),
    ]);

    // End
    await transaction.end();

    return { id: tenantId, indicator: adminDataInAdminTenant.resource.indicator };
  }
}
