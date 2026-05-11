/**
 * 従業員申請のビジネスロジック関連のカスタムフック集
 *
 * このファイルには、従業員申請に関するビジネスロジックとAPI操作が
 * まとめられています。UI操作とは分離されており、データの取得・更新・削除
 * および未登録グループの管理を行います。
 *
 * 主な機能：
 * - 従業員データのCRUD操作
 * - 従業員申請の送信処理
 * - 未登録グループの管理
 * - エラーハンドリングとトースト通知
 */
import { useState } from 'react';
import {
  useCreateEmployee,
  useDeleteEmployee,
  useGetEmployees,
  useUpdateEmployee,
  useUpsertEmployees,
} from '@/api/employeesApi';
import {
  useGetHealthCenterSubmissionStatus,
  useUpdateHealthCenterSubmissionStatus,
} from '@/api/healthCenterSubmissionStatusApi';
import {
  ORDER_TYPES,
  useGetUnregisteredGroup,
  useMutateUnregisteredGroup,
} from '@/api/unRegisteredGroupApi';
import { NEED_APPLICATION } from '@/utils/constants';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';
import {
  useEmployeesForm,
  useEmployeesFormHandlers,
  useEmployeesFormState,
} from './EmployeesFrom/hooks';
import { EmployeeFormItem } from './schema';

/**
 * 従業員API操作の基本機能を提供するhook
 *
 * 従業員データのCRUD操作を行うAPIクライアントを提供します。
 * 各操作にはエラーハンドリングとデータ再取得が含まれています。
 *
 * @param groupId - 対象のグループID
 * @returns API操作メソッドとローディング状態
 */
export const useEmployeesApiClient = (groupId: number) => {
  // 従業員データ取得とミューテーション関数の取得
  const {
    employees: getEmployeesData,
    isLoading,
    hasError,
    mutateEmployees,
  } = useGetEmployees(groupId);

  // 各CRUD操作のAPI hooks
  const { trigger: createEmployee, isMutating: isCreating } =
    useCreateEmployee();
  const { trigger: updateEmployee, isMutating: isUpdating } =
    useUpdateEmployee()();
  const { trigger: upsertEmployees, isMutating: isUpserting } =
    useUpsertEmployees();
  const { trigger: deleteEmployee, isMutating: isDeleting } =
    useDeleteEmployee()();

  /**
   * 従業員新規作成処理
   * @param employees - 作成する従業員データ（配列の最初の要素を使用）
   */
  const handleCreate = async (employees: EmployeeFormItem[]) => {
    try {
      await createEmployee({
        body: {
          group_id: groupId,
          name: employees[0].name,
          student_id: employees[0].studentId,
          stool_test_id: 1, // 固定値
        },
      });
      await mutateEmployees(); // データ再取得
    } catch (error) {
      console.error('Failed to create employee:', error);
      throw error;
    }
  };

  /**
   * 従業員更新処理
   * @param employees - 更新する従業員データ（配列の最初の要素を使用）
   */
  const handleUpdate = async (employees: EmployeeFormItem[]) => {
    const id = employees[0].id;
    if (!id) {
      throw new Error('Employee ID is required');
    }
    try {
      await updateEmployee({
        id,
        body: {
          id,
          group_id: groupId,
          name: employees[0].name,
          student_id: employees[0].studentId,
          stool_test_id: 1,
        },
      });
      await mutateEmployees();
    } catch (error) {
      console.error('Failed to update employee:', error);
      throw error;
    }
  };

  /**
   * 従業員一括更新処理（複数従業員の作成・更新を一度に実行）
   * @param employees - 処理する従業員データの配列
   */
  const handleUpsert = async (employees: EmployeeFormItem[]) => {
    try {
      await upsertEmployees({
        body: {
          employees: employees.map((employee) => ({
            group_id: groupId,
            name: employee.name,
            student_id: employee.studentId,
            stool_test_id: 1,
            ...(employee.id && { id: employee.id }), // IDがある場合のみ含める
          })),
        },
      });
      await mutateEmployees();
    } catch (error) {
      console.error('Failed to upsert employees:', error);
      throw error;
    }
  };

  /**
   * 従業員削除処理
   * @param id - 削除する従業員のID
   */
  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      await mutateEmployees();
    } catch (error) {
      console.error('Failed to delete employee:', error);
      throw error;
    }
  };

  return {
    getEmployeesData,
    isLoading,
    isCreating,
    isUpdating,
    isUpserting,
    isDeleting,
    hasError,
    mutateEmployees,
    createEmployee: handleCreate,
    updateEmployee: handleUpdate,
    upsertEmployees: handleUpsert,
    deleteEmployee: handleDelete,
  };
};

/**
 * 従業員申請のビジネスロジックを管理するhook
 *
 * 従業員申請の送信処理、従業員データの操作、成功・失敗時の
 * トースト通知などのビジネスロジックを提供します。
 *
 * @param groupId - 対象のグループID
 * @param callbacks - 成功・失敗時のコールバック関数
 * @returns ビジネスロジック操作のメソッド群
 */
export const useEmployeesBusinessHooks = (
  groupId: number,
  callbacks: {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
  }
) => {
  const { t } = useTranslation('common');
  const {
    getEmployeesData,
    mutateEmployees,
    createEmployee,
    upsertEmployees,
    isCreating,
    isUpserting,
    deleteEmployee,
    updateEmployee,
  } = useEmployeesApiClient(groupId);

  /**
   * 従業員申請「いいえ」（従業員を申請する）の場合の送信処理
   * 従業員数に応じて単一作成/更新または一括処理を選択します
   */
  const handleEmployeeApplicationSubmit = async (data: {
    needApplication: 'yes' | 'no';
    employees: EmployeeFormItem[];
  }) => {
    try {
      if (data.employees.length === 1) {
        // 従業員が1人の場合：単一作成または更新
        const employee = data.employees[0];
        if (employee?.id) {
          await updateEmployee([employee]); // 既存従業員の更新
        } else {
          await createEmployee(data.employees); // 新規従業員の作成
        }
      } else {
        // 従業員が複数の場合：一括処理
        await upsertEmployees(data.employees);
      }
      await mutateEmployees();
      callbacks.onSuccess?.(
        t('applications.employees.messages.applicationSuccess')
      );
    } catch (error) {
      console.error('Error in employee application:', error);
      callbacks.onError?.(
        t('applications.employees.messages.applicationFailed')
      );
      throw error;
    }
  };

  /**
   * 従業員申請「はい」（従業員申請しない）の場合の送信処理
   * 既存の従業員データがあれば全て削除します
   */
  const handleNoApplicationSubmit = async () => {
    try {
      // 既存の従業員データがあれば削除
      if (getEmployeesData && getEmployeesData.length > 0) {
        for (const employee of getEmployeesData) {
          if (employee.id) {
            await deleteEmployee(employee.id);
          }
        }
        await mutateEmployees();
      }
      callbacks.onSuccess?.(
        t('applications.employees.messages.noApplicationSuccess')
      );
    } catch (error) {
      console.error('Error in no application:', error);
      callbacks.onError?.(
        t('applications.employees.messages.noApplicationFailed')
      );
      throw error;
    }
  };

  /**
   * 従業員個別削除処理（トースト通知付き）
   * フォーム内での従業員削除時に使用します
   */
  const handleEmployeeDeleteWithToast = async (employeeId: number) => {
    try {
      await deleteEmployee(employeeId);
      callbacks.onSuccess?.(t('applications.employees.messages.deleteSuccess'));
      await mutateEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      callbacks.onError?.(t('applications.employees.messages.deleteFailed'));
      throw error;
    }
  };

  return {
    getEmployeesData,
    mutateEmployees,
    isCreating,
    isUpserting,
    handleEmployeeApplicationSubmit,
    handleNoApplicationSubmit,
    handleEmployeeDeleteWithToast,
  };
};

/**
 * 未登録グループ関連のロジックを管理するhook
 *
 * 「代表と副代表だけで活動する」選択をした場合の未登録グループの
 * 登録・削除処理を管理します。
 *
 * @param groupId - 対象のグループID
 * @param callbacks - 成功・失敗時のコールバック関数
 * @returns 未登録グループ操作のメソッド群
 */
export const useUnregisteredGroupHooks = (
  groupId: number,
  callbacks: {
    onSuccess?: (message: string) => void;
    onError?: (message: string) => void;
  }
) => {
  const { t } = useTranslation('common');
  // 未登録グループの操作API
  const { registerUnregisteredGroup, deleteUnregisteredGroup } =
    useMutateUnregisteredGroup(ORDER_TYPES.EMPLOYEE);

  // 未登録グループデータの取得
  const { unregisteredData, mutateUnregisteredGroup } = useGetUnregisteredGroup(
    groupId,
    ORDER_TYPES.EMPLOYEE
  );

  /**
   * 未登録グループを登録する
   * 「代表と副代表だけで活動する」を選択した場合に実行
   */
  const handleRegisterUnregisteredGroup = async () => {
    try {
      await registerUnregisteredGroup(groupId);
      await mutateUnregisteredGroup(); // データ再取得
    } catch (error) {
      console.error('Error registering unregistered group:', error);
      callbacks.onError?.(
        t('applications.employees.messages.registerUnregisteredFailed')
      );
      throw error;
    }
  };

  /**
   * 未登録グループを削除する
   * 「従業員を申請する」に変更した場合に実行
   */
  const handleDeleteUnregisteredGroup = async () => {
    try {
      if (unregisteredData) {
        await deleteUnregisteredGroup(unregisteredData);
        await mutateUnregisteredGroup();
      }
    } catch (error) {
      console.error('Error deleting unregistered group:', error);
      callbacks.onError?.(
        t('applications.employees.messages.deleteUnregisteredFailed')
      );
      throw error;
    }
  };

  return {
    unregisteredData,
    mutateUnregisteredGroup,
    handleRegisterUnregisteredGroup,
    handleDeleteUnregisteredGroup,
  };
};

/**
 * Employeesコンポーネントのメインロジックを管理するhook
 *
 * このhookはEmployeesコンポーネントのすべてのビジネスロジック、
 * 状態管理、イベントハンドリングを担当します。
 * UIコンポーネントからはこのhookのみを使用することで、
 * ロジックとUIの完全な分離を実現します。
 *
 * @param groupId - 対象のグループID
 * @param isDeadline - 申請期限が過ぎているかどうか
 * @param mutateCheckAllRegisteredGroups - グループ登録状況を更新するコールバック
 * @param status - 申請のステータス（APPLICATION_STATUSの値）
 * @returns コンポーネントで必要なすべての状態とハンドラ
 */
export const useEmployeesApplicationHooks = (
  groupId: number,
  isDeadline?: boolean,
  mutateCheckAllRegisteredGroups?: () => void,
  status?: string
) => {
  // 編集モードの状態管理
  const [isEditing, setEditing] = useState(false);
  const { t } = useTranslation('common');
  const isResubmission = status === 'waiting_resubmission'; // 再提出待ちの状態かどうか

  // トースト通知とステータス更新のコールバック
  const toastCallbacks = {
    onSuccess: (message: string) => {
      toast.success(message);
      // 従業員申請完了後にグループ登録状況を更新
      mutateCheckAllRegisteredGroups?.();
    },
    onError: (message: string) => toast.error(message),
  };

  //ステータス変更処理
  const { healthCenterSubmissionStatus, mutateHealthCenterSubmissionStatus } =
    useGetHealthCenterSubmissionStatus(groupId);
  const { trigger: patchHealthCenterSubmissionStatus } =
    useUpdateHealthCenterSubmissionStatus();

  const updateStatus = async (status: 'unapproved') => {
    const employeeSubmission = healthCenterSubmissionStatus.find(
      (submission) => submission.applicationType === 'employee'
    );

    if (!employeeSubmission?.id) {
      throw new Error('Employee submission status id not found');
    }

    await patchHealthCenterSubmissionStatus({
      id: employeeSubmission.id,
      body: { status },
    });

    await mutateHealthCenterSubmissionStatus();
  };

  // ビジネスロジック関連のhooks
  const employeesBusinessHooks = useEmployeesBusinessHooks(
    groupId,
    toastCallbacks
  );
  const unregisteredGroupHooks = useUnregisteredGroupHooks(
    groupId,
    toastCallbacks
  );

  // フォーム関連のhooks（既存データがある場合はそれを、ない場合は空配列を初期値に設定）
  const form = useEmployeesForm(
    employeesBusinessHooks.getEmployeesData &&
      employeesBusinessHooks.getEmployeesData.length > 0
      ? {
          needApplication: undefined,
          employees: employeesBusinessHooks.getEmployeesData,
        }
      : { needApplication: undefined, employees: [] }
  );

  // フォーム状態の監視
  const formState = useEmployeesFormState(form);

  // フォーム操作のイベントハンドラ
  const formHandlers = useEmployeesFormHandlers(form, {
    onEmployeeDelete: employeesBusinessHooks.handleEmployeeDeleteWithToast,
    onMutateEmployees: async () => {
      await employeesBusinessHooks.mutateEmployees();
    },
  });

  // ===============================
  // UIイベントハンドラ群
  // ===============================

  /**
   * 編集ボタンクリック時の処理
   */
  const handleEdit = async () => {
    await formHandlers.handleEditStart(employeesBusinessHooks.getEmployeesData);
    setEditing(true);
  };

  /**
   * ラジオボタン変更時の処理
   */
  const handleRadioChange = async (value: string) => {
    await formHandlers.handleNeedApplicationChange(
      value,
      employeesBusinessHooks.getEmployeesData
    );
    setEditing(true);
  };

  /**
   * 従業員削除ボタンクリック時の処理
   */
  const handleEmployeeDelete = async (field: EmployeeFormItem, idx: number) => {
    await formHandlers.handleEmployeeRemove(field, idx);
  };

  /**
   * 未登録グループ状態での編集ボタンクリック時の処理
   */
  const handleEditClick = async () => {
    await unregisteredGroupHooks.handleDeleteUnregisteredGroup();
    setEditing(true);
  };

  /**
   * 「代表・副代表のみで活動」選択時の登録処理
   */
  const handleNoApplicationClick = async () => {
    try {
      await employeesBusinessHooks.handleNoApplicationSubmit();
      await unregisteredGroupHooks.handleRegisterUnregisteredGroup();
      setEditing(false);
    } catch {
      // エラーハンドリングはhook内で処理済み
    }
  };

  /**
   * フォーム送信時の処理
   */
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      if (data.needApplication === NEED_APPLICATION.YES && data.employees) {
        // 従業員申請ありの場合
        await unregisteredGroupHooks.handleDeleteUnregisteredGroup();
        await employeesBusinessHooks.handleEmployeeApplicationSubmit({
          needApplication: data.needApplication,
          employees: data.employees,
        });
      } else if (data.needApplication === NEED_APPLICATION.NO) {
        // 従業員申請なしの場合
        await employeesBusinessHooks.handleNoApplicationSubmit();
        await unregisteredGroupHooks.handleRegisterUnregisteredGroup();
      }

      // 再提出完了時
      if (status === 'waiting_resubmission') {
        // status更新処理
        try{
        await updateStatus('unapproved');
        }catch(error){
          console.error('Failed to update submission status:', error);
          toast.error(t('applications.employees.messages.statusUpdateFailed'));
          throw error; // Re-throw to prevent setEditing(false) on failure
      }

      setEditing(false);
    } catch {
      // エラーハンドリングはhook内で処理済み
    }
  });

  // ===============================
  // 表示状態の判定ロジック
  // ===============================

  /**
   * 申請しないデータがあるかどうか
   */
  const isUnregisteredGroup = !!unregisteredGroupHooks.unregisteredData;
  const isEmployeesData = employeesBusinessHooks.getEmployeesData?.length > 0;

  /**
   * 申請期限切れかつ、未登録状態（従業員データと申請しないデータが無い）
   */
  const isDeadlineMode = isDeadline && !isUnregisteredGroup && !isEmployeesData;

  /**
   * フォームリスト表示状態かどうか
   * 期限内かつ、従業員データがあり、非編集モードの場合
   */
  const isFormListMode = isEmployeesData && !isEditing;

  /**
   * フォーム表示用のテーブルデータ
   */
  const tableData =
    employeesBusinessHooks.getEmployeesData?.map((i) => ({
      name: i.name,
      studentId: i.studentId,
    })) || [];

  const texts = {
    title: t('applications.employees.title'),
    deadline: {
      title: t('applications.employees.deadline.title'),
      description: t('applications.employees.deadline.description'),
    },
    summary: {
      noApplication: {
        label: t('applications.employees.summary.noApplication.label'),
        description: t(
          'applications.employees.summary.noApplication.description'
        ),
      },
      headers: {
        name: t('applications.employees.summary.headers.name'),
        studentId: t('applications.employees.summary.headers.studentId'),
      },
    },
    radio: {
      label: t('applications.employees.radio.label'),
      options: [
        { id: 1, name: t('applications.employees.radio.options.yes') },
        { id: 2, name: t('applications.employees.radio.options.no') },
      ],
    },
    buttons: {
      addEmployee: t('applications.employees.buttons.addEmployee'),
    },
    formActions: {
      register: t('form.actions.register'),
    },
  };

  return {
    // 状態
    isUnregisteredGroup,
    isFormListMode,
    isDeadlineMode,
    tableData,
    texts,

    // フォーム関連
    form,
    formState,

    // ビジネスロジック
    employeesBusinessHooks,
    unregisteredGroupHooks,

    // イベントハンドラ
    handleEdit,
    handleRadioChange,
    handleEmployeeDelete,
    handleEditClick,
    handleNoApplicationClick,
    handleSubmit,
    updateStatus,

    // UI用プロパティ
    isDeadline,
    isResubmission,
  };
};
