import LRUCache from 'lru-cache';

import Tenant from './Tenant.js';

export class TenantPool {
  protected cache = new LRUCache<string, Tenant>({ max: 500 });

  async get(tenantId: string): Promise<Tenant> {
    const tenant = this.cache.get(tenantId);

    if (tenant) {
      return tenant;
    }

    console.log('Init tenant:', tenantId);
    const newTenant = await Tenant.create(tenantId);
    this.cache.set(tenantId, newTenant);

    return newTenant;
  }

  async endAll(): Promise<void> {
    await Promise.all(
      this.cache.dump().flatMap(([, tenant]) => {
        const { poolSafe, queryClientSafe } = tenant.value.envSet;

        return [poolSafe?.end(), queryClientSafe?.end()];
      })
    );
  }
}

export const tenantPool = new TenantPool();

export * from './utils.js';
