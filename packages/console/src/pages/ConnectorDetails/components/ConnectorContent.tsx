import type { ConnectorResponse } from '@logto/schemas';
import { ConnectorType } from '@logto/schemas';
import { conditional } from '@silverhand/essentials';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import DetailsForm from '@/components/DetailsForm';
import FormCard from '@/components/FormCard';
import UnsavedChangesAlertModal from '@/components/UnsavedChangesAlertModal';
import useApi from '@/hooks/use-api';
import useDocumentationUrl from '@/hooks/use-documentation-url';
import BasicForm from '@/pages/Connectors/components/ConnectorForm/BasicForm';
import ConfigForm from '@/pages/Connectors/components/ConnectorForm/ConfigForm';
import { useConfigParser } from '@/pages/Connectors/components/ConnectorForm/hooks';
import { initFormData, parseFormConfig } from '@/pages/Connectors/components/ConnectorForm/utils';
import type { ConnectorFormType } from '@/pages/Connectors/types';
import { SyncProfileMode } from '@/pages/Connectors/types';

import * as styles from './ConnectorContent.module.scss';
import SenderTester from './SenderTester';

type Props = {
  isDeleted: boolean;
  connectorData: ConnectorResponse;
  onConnectorUpdated: (connector: ConnectorResponse) => void;
};

const ConnectorContent = ({ isDeleted, connectorData, onConnectorUpdated }: Props) => {
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });
  const { getDocumentationUrl } = useDocumentationUrl();
  const parseJsonConfig = useConfigParser();
  const api = useApi();
  const methods = useForm<ConnectorFormType>({
    reValidateMode: 'onBlur',
    defaultValues: {
      syncProfile: SyncProfileMode.OnlyAtRegister,
    },
  });
  const {
    formState: { isSubmitting, isDirty },
    handleSubmit,
    watch,
    reset,
  } = methods;
  const isSocialConnector = connectorData.type === ConnectorType.Social;

  useEffect(() => {
    const { formItems, metadata, config, syncProfile } = connectorData;
    const { name, logo, logoDark, target } = metadata;

    reset({
      ...(formItems ? initFormData(formItems, config) : {}),
      target,
      logo,
      logoDark: logoDark ?? '',
      name: name?.en,
      config: JSON.stringify(config, null, 2),
      syncProfile: syncProfile ? SyncProfileMode.EachSignIn : SyncProfileMode.OnlyAtRegister,
    });
  }, [connectorData, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const { formItems, isStandard, id } = connectorData;
    const config = formItems ? parseFormConfig(data, formItems) : parseJsonConfig(data.config);
    const { syncProfile, name, logo, logoDark, target } = data;

    const payload = isSocialConnector
      ? {
          config,
          syncProfile: syncProfile === SyncProfileMode.EachSignIn,
        }
      : { config };
    const standardConnectorPayload = {
      ...payload,
      metadata: { name: { en: name }, logo, logoDark, target },
    };
    const body = isStandard ? standardConnectorPayload : payload;

    const updatedConnector = await api
      .patch(`api/connectors/${id}`, {
        json: body,
      })
      .json<ConnectorResponse>();

    onConnectorUpdated(updatedConnector);
    toast.success(t('general.saved'));
  });

  return (
    <FormProvider {...methods}>
      <DetailsForm
        isDirty={isDirty}
        isSubmitting={isSubmitting}
        onDiscard={reset}
        onSubmit={onSubmit}
      >
        {isSocialConnector && (
          <FormCard
            title="connector_details.settings"
            description="connector_details.settings_description"
            learnMoreLink={getDocumentationUrl('/docs/references/connectors')}
          >
            <BasicForm
              connectorType={connectorData.type}
              isStandard={connectorData.isStandard}
              isDarkDefaultVisible={Boolean(connectorData.metadata.logoDark)}
            />
          </FormCard>
        )}
        <FormCard
          title="connector_details.parameter_configuaration"
          description={conditional(!isSocialConnector && 'connector_details.settings_description')}
          learnMoreLink={conditional(
            !isSocialConnector && getDocumentationUrl('/docs/references/connectors')
          )}
        >
          <ConfigForm formItems={connectorData.formItems} />
        </FormCard>
        {/* Tell typescript that the connectorType is Email or Sms */}
        {connectorData.type !== ConnectorType.Social && (
          <FormCard title="connector_details.test_connection">
            <SenderTester
              className={styles.senderTest}
              connectorId={connectorData.id}
              connectorType={connectorData.type}
              config={watch('config')}
            />
          </FormCard>
        )}
      </DetailsForm>
      <UnsavedChangesAlertModal hasUnsavedChanges={!isDeleted && isDirty} />
    </FormProvider>
  );
};

export default ConnectorContent;
