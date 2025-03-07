import type { User } from '@logto/schemas';
import { conditional } from '@silverhand/essentials';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import useSWR from 'swr';

import Plus from '@/assets/images/plus.svg';
import ApplicationName from '@/components/ApplicationName';
import Button from '@/components/Button';
import CardTitle from '@/components/CardTitle';
import DateTime from '@/components/DateTime';
import ItemPreview from '@/components/ItemPreview';
import Search from '@/components/Search';
import Table from '@/components/Table';
import UserAvatar from '@/components/UserAvatar';
import { defaultPageSize } from '@/consts';
import { UserDetailsTabs } from '@/consts/page-tabs';
import type { RequestError } from '@/hooks/use-api';
import useSearchParametersWatcher from '@/hooks/use-search-parameters-watcher';
import * as resourcesStyles from '@/scss/resources.module.scss';
import { buildUrl, formatSearchKeyword } from '@/utils/url';

import CreateForm from './components/CreateForm';
import * as styles from './index.module.scss';

const pageSize = defaultPageSize;
const usersPathname = '/users';
const createUserPathname = `${usersPathname}/create`;
const buildDetailsPathname = (id: string) => `${usersPathname}/${id}/${UserDetailsTabs.Settings}`;

const Users = () => {
  const { pathname, search } = useLocation();
  const isCreateNew = pathname === createUserPathname;
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });

  const [{ page, keyword }, updateSearchParameters] = useSearchParametersWatcher({
    page: 1,
    keyword: '',
  });

  const url = buildUrl('api/users', {
    page: String(page),
    page_size: String(pageSize),
    ...conditional(keyword && { search: formatSearchKeyword(keyword) }),
  });

  const { data, error, mutate } = useSWR<[User[], number], RequestError>(url);
  const isLoading = !data && !error;
  const navigate = useNavigate();
  const [users, totalCount] = data ?? [];

  return (
    <div className={resourcesStyles.container}>
      <div className={resourcesStyles.headline}>
        <CardTitle title="users.title" subtitle="users.subtitle" />
        <Button
          title="users.create"
          size="large"
          type="primary"
          icon={<Plus />}
          onClick={() => {
            navigate({
              pathname: createUserPathname,
              search,
            });
          }}
        />
        {isCreateNew && (
          <CreateForm
            onClose={() => {
              navigate({
                pathname: usersPathname,
                search,
              });
            }}
            onCreate={() => {
              void mutate();
            }}
          />
        )}
      </div>
      <Table
        className={resourcesStyles.table}
        rowGroups={[{ key: 'users', data: users }]}
        rowIndexKey="id"
        isLoading={isLoading}
        errorMessage={error?.body?.message ?? error?.message}
        columns={[
          {
            title: t('users.user_name'),
            dataIndex: 'name',
            colSpan: 6,
            render: ({ id, name, avatar }) => (
              <ItemPreview
                title={name ?? t('users.unnamed')}
                subtitle={id}
                icon={<UserAvatar className={styles.avatar} url={avatar} />}
                to={buildDetailsPathname(id)}
                size="compact"
              />
            ),
          },
          {
            title: t('users.application_name'),
            dataIndex: 'app',
            colSpan: 5,
            render: ({ applicationId }) =>
              applicationId ? <ApplicationName applicationId={applicationId} /> : <div>-</div>,
          },
          {
            title: t('users.latest_sign_in'),
            dataIndex: 'lastSignInAt',
            colSpan: 5,
            render: ({ lastSignInAt }) => <DateTime>{lastSignInAt}</DateTime>,
          },
        ]}
        filter={
          <Search
            inputClassName={styles.searchInput}
            placeholder={t('users.search')}
            defaultValue={keyword}
            isClearable={Boolean(keyword)}
            onSearch={(keyword) => {
              updateSearchParameters({ keyword, page: 1 });
            }}
            onClearSearch={() => {
              updateSearchParameters({ keyword: '', page: 1 });
            }}
          />
        }
        placeholder={{
          content: (
            <Button
              title="users.create"
              type="outline"
              onClick={() => {
                navigate({
                  pathname: createUserPathname,
                  search,
                });
              }}
            />
          ),
        }}
        rowClickHandler={({ id }) => {
          navigate(buildDetailsPathname(id));
        }}
        pagination={{
          page,
          pageSize,
          totalCount,
          onChange: (page) => {
            updateSearchParameters({ page });
          },
        }}
        onRetry={async () => mutate(undefined, true)}
      />
    </div>
  );
};

export default Users;
