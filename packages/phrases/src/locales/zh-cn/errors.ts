const errors = {
  request: {
    invalid_input: 'Input is invalid. {{details}}', // UNTRANSLATED
    general: 'Request error occurred.', // UNTRANSLATED
  },
  auth: {
    authorization_header_missing: 'Authorization 请求头缺失。',
    authorization_token_type_not_supported: 'Authorization token 类型不支持',
    unauthorized: '未经授权。请检查凭据及其范围。',
    forbidden: '禁止访问。请检查用户 role 与权限。',
    expected_role_not_found: '未找到期望的 role。请检查用户 role 与权限。',
    jwt_sub_missing: 'JWT 缺失 `sub`',
    require_re_authentication: '需要重新认证以进行受保护操作。',
  },
  guard: {
    invalid_input: '请求中 {{type}} 无效',
    invalid_pagination: '分页参数无效',
  },
  oidc: {
    aborted: '用户终止了交互。',
    invalid_scope: '不支持的 scope: {{scopes}}',
    invalid_scope_plural: '不支持的 scope: {{scopes}}',
    invalid_token: 'Token 无效',
    invalid_client_metadata: '无效的客户端元数据',
    insufficient_scope: '请求 token 缺少权限: {{scopes}}',
    invalid_request: '请求无效',
    invalid_grant: '授权请求无效',
    invalid_redirect_uri: '无效返回链接, 该 redirect_uri 未被此应用注册。',
    access_denied: '拒绝访问',
    invalid_target: '请求资源无效',
    unsupported_grant_type: '不支持的 grant_type',
    unsupported_response_mode: '不支持的 response_mode',
    unsupported_response_type: '不支持的 response_type',
    provider_error: 'OIDC 内部错误: {{message}}',
  },
  user: {
    username_already_in_use: '该用户名已被使用。',
    email_already_in_use: '该邮箱地址已被使用。',
    phone_already_in_use: '该手机号码已被使用。',
    invalid_email: '邮箱地址不正确。',
    invalid_phone: '手机号码不正确。',
    email_not_exist: '邮箱地址尚未注册。',
    phone_not_exist: '手机号码尚未注册。',
    identity_not_exist: '该社交帐号尚未注册。',
    identity_already_in_use: '该社交帐号已被注册。',
    cannot_delete_self: '无法删除自己的账户。',
    sign_up_method_not_enabled: '注册方式尚未启用。',
    sign_in_method_not_enabled: '登录方式尚未启用。',
    same_password: '为确保账户安全，新密码不能与旧密码一致。',
    password_required_in_profile: '请设置登录密码。',
    new_password_required_in_profile: '请设置新密码。',
    password_exists_in_profile: '当前用户已设置密码，无需重复操作。',
    username_required_in_profile: '请设置用户名。',
    username_exists_in_profile: '当前用户已设置用户名，无需重复操作。',
    email_required_in_profile: '请绑定邮箱地址',
    email_exists_in_profile: '当前用户已绑定邮箱，无需重复操作。',
    phone_required_in_profile: '请绑定手机号码。',
    phone_exists_in_profile: '当前用户已绑定手机号，无需重复操作。',
    email_or_phone_required_in_profile: '请绑定邮箱地址或手机号码。',
    suspended: '账号已被禁用。',
    user_not_exist: '未找到与 {{ identifier }} 相关联的用户。',
    missing_profile: '请于登录时提供必要的用户补充信息。',
    role_exists: 'The role id {{roleId}} is already been added to this user', // UNTRANSLATED
  },
  password: {
    unsupported_encryption_method: '不支持的加密方法 {{name}}',
    pepper_not_found: '密码 pepper 未找到。请检查 core 的环境变量。',
  },
  session: {
    not_found: '未找到会话。请返回并重新登录。',
    invalid_credentials: '账号或密码错误。',
    invalid_sign_in_method: '当前登录方式不可用',
    invalid_connector_id: '找不到 ID 为 {{connectorId}} 的可用连接器。',
    insufficient_info: '登录信息缺失，请检查你的输入。',
    connector_id_mismatch: '传入的连接器 ID 与 session 中保存的记录不一致',
    connector_session_not_found: '无法找到连接器登录信息，请尝试重新登录。',
    verification_session_not_found: '验证失败，请重新验证。',
    verification_expired: '当前页面已超时。为确保你的账号安全，请重新验证。',
    unauthorized: '请先登录',
    unsupported_prompt_name: '不支持的 prompt name',
    forgot_password_not_enabled: '忘记密码功能没有开启。',
    verification_failed: '验证失败，请重新验证。',
    connector_validation_session_not_found: '找不到连接器用于验证 token 的信息。',
    identifier_not_found: 'User identifier not found. Please go back and sign in again.', // UNTRANSLATED
    interaction_not_found:
      'Interaction session not found. Please go back and start the session again.', // UNTRANSLATED
  },
  connector: {
    general: '连接器发生未知错误{{errorDescription}}',
    not_found: '找不到可用的 {{type}} 类型的连接器',
    not_enabled: '连接器尚未启用',
    invalid_metadata: '连接器 metadata 参数错误',
    invalid_config_guard: '连接器配置 guard 错误',
    unexpected_type: '连接器类型错误',
    insufficient_request_parameters: '请求参数缺失',
    invalid_request_parameters: '请求参数错误',
    invalid_config: '连接器配置错误',
    invalid_response: '连接器错误响应',
    template_not_found: '无法从连接器配置中找到对应的模板',
    not_implemented: '方法 {{method}} 尚未实现',
    social_invalid_access_token: '当前连接器的 access_token 无效',
    invalid_auth_code: '当前连接器的授权码无效',
    social_invalid_id_token: '当前连接器的 id_token 无效',
    authorization_failed: '用户授权流程失败',
    social_auth_code_invalid: '无法获取 access_token，请检查授权 code 是否有效',
    more_than_one_sms: '同时存在超过 1 个短信连接器',
    more_than_one_email: '同时存在超过 1 个邮件连接器',
    more_than_one_connector_factory: '找到多个连接器工厂（id 为 {{connectorIds}}），请删除多余项。',
    db_connector_type_mismatch: '数据库中存在一个类型不匹配的连接。',
    not_found_with_connector_id: '找不到所给 connector id 对应的连接器',
    multiple_instances_not_supported: '你选择的连接器不支持创建多实例。',
    invalid_type_for_syncing_profile: '只有社交连接器可以开启用户档案同步。',
    can_not_modify_target: '不可修改连接器 target。',
    should_specify_target: '你需要声明 target 的值。',
    multiple_target_with_same_platform: '同一平台上，多个社交连接器不能重复使用相同的 “Target”。',
    cannot_overwrite_metadata_for_non_standard_connector: '不可覆盖该连接器的 metadata 参数。',
  },
  verification_code: {
    phone_email_empty: '手机号与邮箱地址均为空',
    not_found: '验证码不存在，请先请求发送验证码',
    phone_mismatch: '手机号码不匹配，请尝试请求新的验证码。',
    email_mismatch: '邮箱地址不匹配，请尝试请求新的验证码。',
    code_mismatch: '验证码不正确',
    expired: '验证码已过期，请尝试请求新的验证码。',
    exceed_max_try: '超过最大验证次数，请尝试请求新的验证码。',
  },
  sign_in_experiences: {
    empty_content_url_of_terms_of_use: '你启用了“使用条款”，请添加使用条款 URL。',
    empty_logo: '请输入 logo URL',
    empty_slogan: '你选择了 App logo + 标语的布局。请输入你的标语。',
    empty_social_connectors: '你启用了社交登录的方式。请至少选择一个社交连接器。',
    enabled_connector_not_found: '未找到已启用的 {{type}} 连接器',
    not_one_and_only_one_primary_sign_in_method: '主要的登录方式必须有且仅有一个，请检查你的输入。',
    username_requires_password: 'Must enable set a password for username sign up identifier.', // UNTRANSLATED
    passwordless_requires_verify: 'Must enable verify for email/phone sign up identifier.', // UNTRANSLATED
    miss_sign_up_identifier_in_sign_in: 'Sign in methods must contain the sign up identifier.', // UNTRANSLATED
    password_sign_in_must_be_enabled:
      'Password sign in must be enabled when set a password is required in sign up.', // UNTRANSLATED
    code_sign_in_must_be_enabled:
      'Verification code sign in must be enabled when set a password is not required in sign up.', // UNTRANSLATED
    unsupported_default_language: '{{language}}无法选择为默认语言。',
    at_least_one_authentication_factor: '至少要选择一个登录要素',
  },
  localization: {
    cannot_delete_default_language: '你已设置{{languageTag}}为你的默认语言，你无法删除默认语言。',
    invalid_translation_structure: '无效的数据格式，请检查你的输入并重试。',
  },
  swagger: {
    invalid_zod_type: '无效的 Zod 类型，请检查路由 guard 配置。',
    not_supported_zod_type_for_params: '请求参数不支持的 Zod 类型，请检查路由 guard 配置。',
  },
  entity: {
    create_failed: '创建 {{name}} 失败',
    not_exists: '该 {{name}} 不存在',
    not_exists_with_id: 'ID 为 `{{id}}` 的 {{name}} 不存在',
    not_found: '该资源不存在',
  },
  log: {
    invalid_type: 'The log type is invalid.', // UNTRANSLATED
  },
  role: {
    name_in_use: 'This role name {{name}} is already in use', // UNTRANSLATED
    scope_exists: 'The scope id {{scopeId}} has already been added to this role', // UNTRANSLATED
    user_exists: 'The user id {{userId}} is already been added to this role', // UNTRANSLATED
    default_role_missing:
      'Some of the default roleNames does not exist in database, please ensure to create roles first', // UNTRANSLATED
  },
  scope: {
    name_exists: 'The scope name {{name}} is already in use', // UNTRANSLATED
    name_with_space: 'The name of the scope cannot contain any spaces.', // UNTRANSLATED
  },
};

export default errors;
