import type { ScopeResponse } from '@logto/schemas';
import classNames from 'classnames';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CaretExpanded from '@/assets/images/caret-expanded.svg';
import CaretFolded from '@/assets/images/caret-folded.svg';
import Checkbox from '@/components/Checkbox';
import IconButton from '@/components/IconButton';
import { onKeyDownHandler } from '@/utils/a11y';

import type { DetailedResourceResponse } from '../../types';
import SourceScopeItem from '../SourceScopeItem';
import * as styles from './index.module.scss';

type Props = {
  resource: DetailedResourceResponse;
  selectedScopes: ScopeResponse[];
  onSelectResource: (resource: DetailedResourceResponse) => void;
  onSelectScope: (scope: ScopeResponse) => void;
};

const ResourceItem = ({ resource, selectedScopes, onSelectResource, onSelectScope }: Props) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });
  const { name, scopes } = resource;
  const selectedScopesCount = selectedScopes.length;
  const totalScopesCount = scopes.length;
  const [isScopesInvisible, setIsScopesInvisible] = useState(true);

  return (
    <div className={styles.resourceItem}>
      <div className={styles.title}>
        <Checkbox
          checked={selectedScopesCount === totalScopesCount}
          indeterminate={selectedScopesCount > 0 && selectedScopesCount < totalScopesCount}
          onChange={() => {
            onSelectResource(resource);
          }}
        />
        <div
          role="button"
          tabIndex={0}
          className={styles.resource}
          onKeyDown={onKeyDownHandler(() => {
            setIsScopesInvisible(!isScopesInvisible);
          })}
          onClick={() => {
            setIsScopesInvisible(!isScopesInvisible);
          }}
        >
          <IconButton size="small" className={styles.caret}>
            {isScopesInvisible ? <CaretFolded /> : <CaretExpanded />}
          </IconButton>
          <div className={styles.name}>{name}</div>
          <div className={styles.scopeInfo}>
            ({t('role_details.permission.api_permission_count', { count: scopes.length })})
          </div>
        </div>
      </div>
      <div className={classNames(isScopesInvisible && styles.invisible)}>
        {scopes.map((scope) => (
          <SourceScopeItem
            key={scope.id}
            scope={scope}
            isSelected={selectedScopes.findIndex(({ id }) => scope.id === id) >= 0}
            onSelect={onSelectScope}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourceItem;
